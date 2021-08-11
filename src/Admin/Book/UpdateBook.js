import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input, FormText, Col, Row, CustomInput } from 'reactstrap';
import { endpointPublic, get, getWithAuth, endpointUser, putWithAuth } from '../../components/HttpUtils';

class BookUpdater extends Component {
    state = {
        authorList: [], publisherList: [], categoryList: [], bookName: "", unitPrice: 1, quantity: 0, viewCount: 0,
        discount: 0, checkedAuthorId: [], uploadImage: null, checkboxAvailableChecked: false, errors: {},
        checkboxSpecialChecked: false, base64Str: "", book: {}, specification: "", description: ""
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
        this.fetchBookById();
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
        if (!this.validateForm(e.target.bookName.value.trim(), e.target.unitPrice.value, this.state.checkedAuthorId.length))
            return;

        let photo;
        if (this.state.uploadImage === null)
            photo = this.state.book.photo;
        else
            photo = this.getByteaFromBase64Str(this.state.base64Str);

        const bookBody = {
            "bookName": e.target.bookName.value.trim(),
            "unitPrice": e.target.unitPrice.value,
            "quantity": e.target.quantity.value,
            "discount": e.target.discount.value,
            "photo": photo,
            "description": e.target.description.value,
            "specification": e.target.specification.value,
            "viewCount": e.target.viewCount.value,
            "special": this.state.checkboxSpecialChecked,
            "available": this.state.checkboxAvailableChecked,
            "categoryName": e.target.category.value,
            "publisherName": e.target.publisher.value,
            "authorIds": this.state.checkedAuthorId
        }
        console.log(JSON.stringify(bookBody));

        putWithAuth(endpointUser + "/books/" + this.props.match.params.id, bookBody).then((response) => {
            if (response.status === 200 || response.status === 201) {
                console.log("Update book successfully!");
                alert("Update book successfully!");
                window.location.replace("http://localhost:3000/admin/books");
                this.setState({ book: bookBody })
            }
        }).catch(error => {
            alert("Update new book failed!" + error.response.data.message);
            console.log("error updating book: " + error);
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
                uploadImage: URL.createObjectURL(img)
            });
            this.getBase64(event.target.files[0], (result) => {
                this.state.base64Str = result;
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
        let errors = {}, formIsValid = true;
        if (name.length < 6 || name.length > 250) {
            errors["name"] = 'The length of book name must be in range 6-250';
            formIsValid = false;
        }
        if (price < 10) {
            errors["price"] = 'Price must large than 10!';
            formIsValid = false;
        }
        if (authorsLength === 0) {
            errors["authors"] = 'Please choose an author for book!';
            formIsValid = false;
        }
        this.setState({ errors: errors });

        return formIsValid;
    }

    async fetchBookById() {
        await get(endpointPublic + "/books/" + this.props.match.params.id).then((response) => {
            if (response.status === 200) {
                this.setState({ book: response.data })
                this.setState({ checkedAuthorId: response.data.authorIds })
                this.setState({ checkboxAvailableChecked: response.data.available })
                this.setState({ checkboxSpecialChecked: response.data.special })
                this.setState({ bookName: response.data.bookName })
                this.setState({ unitPrice: response.data.unitPrice })
                this.setState({ discount: response.data.discount })
                this.setState({ quantity: response.data.quantity })
                this.setState({ viewCount: response.data.viewCount })
                this.setState({ description: response.data.description })
                this.setState({ specification: response.data.specification })
            }
        }).catch((error) => console.log("Fetching book by id error: " + error))
    }

    render() {
        return (
            <div>
                <h2>UPDATE BOOK</h2>
                <Form style={{ marginTop: "2.5rem" }} onSubmit={(e) => this.createNewBook(e)}>
                    <Row>
                        <Col sm="6">
                            <FormGroup>
                                <Label for="bookName">Name</Label>
                                <Input type="text" name="bookName" id="bookName" placeholder="Book Name" required
                                    value={this.state.bookName}
                                    onChange={e => this.setState({ bookName: e.target.value })} />
                                <span style={{ color: "red" }}>{this.state.errors["name"]}</span>
                            </FormGroup>
                        </Col>

                        <Col sm="2">
                            <FormGroup>
                                <Label for="unitPrice">Price</Label>
                                <Input type="number" step="0.01" required
                                    name="unitPrice" id="unitPrice" placeholder="Unit price" min="1" defaultValue="1"
                                    value={this.state.unitPrice}
                                    onChange={e => this.setState({ unitPrice: e.target.value })} />
                                <span style={{ color: "red" }}>{this.state.errors["price"]}</span>
                            </FormGroup>
                        </Col>
                        <Col sm="2">
                            <FormGroup>
                                <Label for="discount">Discount</Label>
                                <Input type="number" step="0.001" name="discount" id="discount" placeholder="Discount"
                                    min="0" max="1" defaultValue="0" value={this.state.discount}
                                    onChange={e => this.setState({ discount: e.target.value })} />
                            </FormGroup>
                        </Col>
                        <Col sm="2">
                            <FormGroup>
                                <Label for="quantity">Quantity</Label>
                                <Input type="number" name="quantity" id="quantity"
                                    placeholder="Quantity" min="1" defaultValue="1" value={this.state.quantity}
                                    onChange={e => this.setState({ quantity: e.target.value })} />
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
                                <span style={{ color: "red" }}>{this.state.errors["authors"]}</span>
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col sm="2">
                            <Label for="viewCount">No. View</Label>
                            <Input type="number" name="viewCount" id="viewCount"
                                placeholder="view" min="0" defaultValue="0" value={this.state.viewCount}
                                onChange={e => this.setState({ viewCount: e.target.value })} />
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
                        <Input type="textarea" name="description" id="description" value={this.state.description}
                            onChange={e => this.setState({ description: e.target.value })} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="specification">Specification</Label>
                        <Input type="textarea" name="specification" id="specification" value={this.state.specification}
                            onChange={e => this.setState({ specification: e.target.value })} />
                    </FormGroup>

                    <br />
                    <FormGroup>
                        <Label for="photoFile">Image</Label>
                        <Input type="file" name="photo" id="photoFile" accept="image/*" onChange={(e) => this.onImageChange(e)} />
                        <FormText color="muted">
                            Upload an image
                        </FormText>
                        {this.state.uploadImage !== null ?
                            <img src={this.state.uploadImage} width="200" height="100" alt="No image" />
                            :
                            <img src={`data:image/jpeg;base64,${this.state.book.photo}`} width="200" height="100" alt="No image" />
                        }
                    </FormGroup>

                    <Button style={{ marginTop: "2rem" }} color="primary">Update</Button>
                </Form>
            </div>
        );
    }
}

export default withRouter(BookUpdater);