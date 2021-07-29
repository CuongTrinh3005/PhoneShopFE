import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText, Col, Row, CustomInput } from 'reactstrap';
import { endpointPublic, get, getWithAuth, endpointUser, postwithAuth } from '../../components/HttpUtils';

class BookGenerator extends Component {
    state = {
        authorList: [], publisherList: [], categoryList: [], bookName: "", unitPrice: 1, quantity: 0,
        discount: 0, checkedAuthorId: [], image: null, checkboxAvailableChecked: false,
        checkboxSpecialChecked: false, base64Str: "", book: {}
    }

    fecthAllPublishers() {
        getWithAuth(endpointUser + "/publishers").then((response) => {
            if (response.status === 200) {
                this.setState({ publisherList: response.data })
            }
        }).catch((error) => console.log("Fetching publishers error: " + error))
    }

    fecthAllAuthors() {
        getWithAuth(endpointUser + "/authors").then((response) => {
            if (response.status === 200) {
                this.setState({ authorList: response.data })
            }
        }).catch((error) => console.log("Fetching authors error: " + error))
    }

    fetchCategories() {
        get(endpointPublic + "/categories").then((response) => {
            if (response.status === 200) {
                this.setState({ categoryList: response.data })
            }
        })
    }

    componentDidMount() {
        this.fecthAllPublishers();
        this.fecthAllAuthors();
        this.fetchCategories();
    }

    handleCheckboxChange(event) {
        let options = [], option;
        for (let i = 0, len = event.target.options.length; i < len; i++) {
            option = event.target.options[i];
            if (option.selected) {
                options.push(option.value);
            }
        }
        this.setState({ checkedAuthorId: options });
    }

    createNewBook(e) {
        e.preventDefault();
        if (!this.validateForm(e.target.bookName.value.trim(), e.target.unitPrice.value,
            this.state.checkedAuthorId.length))
            return;

        const bookBody = {
            "bookName": e.target.bookName.value.trim(),
            "unitPrice": e.target.unitPrice.value,
            "quantity": e.target.quantity.value,
            "discount": e.target.discount.value,
            "photo": this.getByteaFromBase64Str(this.state.base64Str),
            "description": e.target.description.value,
            "specification": e.target.specification.value,
            "viewCount": e.target.viewCount.value,
            "special": this.state.checkboxSpecialChecked,
            "available": this.state.checkboxAvailableChecked,
            "categoryName": e.target.category.value,
            "publisherName": e.target.publisher.value,
            "authorIds": this.state.checkedAuthorId
        }
        console.log(bookBody);
        this.setState({ book: bookBody })

        postwithAuth(endpointUser + "/books", bookBody).then((response) => {
            if (response.status === 200 || response.status === 201) {
                console.log("Insert new book successfully!");
                alert("Insert new book successfully!");
                window.location.replace("http://localhost:3000/admin/books");
            }
        }).catch(error => {
            alert("Insert new book failed!" + error.response.data.message);
            console.log("error inserting new book: " + error);
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        })
    }

    getByteaFromBase64Str() {
        if (this.state.base64Str !== "") {
            const byteArr = this.state.base64Str.split(",");
            return byteArr[1];
        }
    }

    onImageChange = event => {
        if (event.target.files && event.target.files[0]) {
            let img = event.target.files[0];
            this.setState({
                image: URL.createObjectURL(img)
            });
            this.getBase64(event.target.files[0], (result) => {
                this.state.base64Str = result;
                // console.log("Base64 string: " + this.state.base64Str);
            });
        }
    };

    handleAvailableChange(event) {
        this.setState({ checkboxAvailableChecked: event.target.checked })
    }

    handleSpecialChange(event) {
        this.setState({ checkboxSpecialChecked: event.target.checked })
    }

    getBase64(file, cb) {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            cb(reader.result)
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }

    validateForm(name, price, authorsLength) {
        if (name === null || name === '' || name === undefined) {
            alert('Please enter book name!');
            return false;
        }
        if (name.length < 6 || name.length > 250) {
            alert('The length of book name must be in range 6-250');
            return false;
        }
        if (price === null || price === undefined || price === 0 || price === 1) {
            alert('Please enter book unit price!');
            return false;
        }
        if (authorsLength === 0) {
            alert('Please choose an author for book!');
            return false;
        }

        return true;
    }

    render() {
        return (
            <div>
                <h2>CREATE NEW BOOK</h2>
                <Form style={{ marginTop: "2.5rem" }} onSubmit={(e) => this.createNewBook(e)}>
                    <Row>
                        <Col sm="6">
                            <FormGroup>
                                <Label for="bookName">Name</Label>
                                <Input type="text" name="bookName" id="bookName" placeholder="Book Name" />
                            </FormGroup>
                        </Col>

                        <Col sm="2">
                            <FormGroup>
                                <Label for="unitPrice">Price</Label>
                                <Input type="number" step="0.01" name="unitPrice" id="unitPrice" placeholder="Unit price" min="1" defaultValue="1" />
                            </FormGroup>
                        </Col>
                        <Col sm="2">
                            <FormGroup>
                                <Label for="discount">Discount</Label>
                                <Input type="number" step="0.001" name="discount" id="discount" placeholder="Discount" min="0" max="1" defaultValue="0" />
                            </FormGroup>
                        </Col>
                        <Col sm="2">
                            <FormGroup>
                                <Label for="quantity">Quantity</Label>
                                <Input type="number" name="quantity" id="quantity" placeholder="Quantity" min="1" defaultValue="1" />
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col sm="9">
                            <FormGroup>
                                <Label for="categorySelect">Select Category</Label>
                                <Input type="select" name="category" id="categorySelect">
                                    {this.state.categoryList.map((cate) => (
                                        <option key={cate.categoryId}>{cate.categoryName}</option>
                                    ))}
                                </Input>
                            </FormGroup>
                        </Col>

                        <Col sm="3" >

                        </Col>
                    </Row>

                    <Row>
                        <Col sm="9">
                            <FormGroup>
                                <Label for="publisherSelect">Select Publisher</Label>
                                <Input type="select" name="publisher" id="publisherSelect">
                                    {this.state.publisherList.map((pub) => (
                                        <option key={pub.publisherId}>{pub.publisherName}</option>
                                    ))}
                                </Input>
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col sm="9">
                            <FormGroup>
                                <Label for="authorSelectMulti">Select Author(s)</Label>
                                <Input type="select" name="authors" multiple id="authorSelectMulti" onChange={(event) => { this.handleCheckboxChange(event) }}>
                                    {this.state.authorList.map((author) => (
                                        <option key={author.authorId} value={author.authorId}>{author.authorName}</option>
                                    ))}
                                </Input>
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col sm="2">
                            <Label for="viewCount">No. View</Label>
                            <Input type="number" name="viewCount" id="viewCount" placeholder="Unit price" min="0" defaultValue="0" />
                        </Col>

                        <Col sm="2">
                            <Label for="available">Available</Label>
                            <div>
                                <CustomInput type="checkbox" id="availableCheckbox" label="Available" name="available" defaultValue="true"
                                    checked={this.state.checkboxAvailableChecked} onChange={(e) => this.handleAvailableChange(e)} />
                            </div>
                        </Col>

                        <Col sm="2">
                            <Label for="special">Special</Label>
                            <div>
                                <CustomInput type="checkbox" name="special" id="specialCheckbox" label="special" defaultValue="false"
                                    checked={this.state.checkboxSpecialChecked} onChange={(e) => this.handleSpecialChange(e)}
                                />
                            </div>
                        </Col>
                    </Row>

                    <FormGroup>
                        <Label for="description">Description</Label>
                        <Input type="textarea" name="description" id="description" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="specification">Specification</Label>
                        <Input type="textarea" name="specification" id="specification" />
                    </FormGroup>

                    <br />
                    <FormGroup>
                        <Label for="photoFile">Image</Label>
                        <Input type="file" name="photo" id="photoFile" accept="image/*" onChange={(e) => this.onImageChange(e)} />
                        <FormText color="muted">
                            Upload an image
                        </FormText>
                        <img src={this.state.image} width="200" height="100" />
                    </FormGroup>

                    <Button style={{ marginTop: "2rem" }} color="primary">ADD</Button>
                </Form>
            </div>
        );
    }
}

export default BookGenerator;