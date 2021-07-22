import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText, Col, Row, CustomInput } from 'reactstrap';
import { endpointPublic, get, getWithAuth, endpointUser } from '../../components/HttpUtils';

class BookGenerator extends Component {
    state = {
        authorList: [], publisherList: [], categoryList: [], bookName: "", unitPrice: 1, quantity: 0,
        discount: 0, checkedAuthorId: [], image: null, checkboxAvailableChecked: false,
        checkboxSpecialChecked: false
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
        alert("Create new book successfully!");
        console.log("name: ", e.target.bookName.value);
        console.log("unit price: ", e.target.unitPrice.value);
        console.log("discount: ", e.target.discount.value);
        console.log("category: ", e.target.category.value);
        console.log("publisher: ", e.target.publisher.value);
        console.log("authors: ", this.state.checkedAuthorId.join(', '));
        console.log("viewCount: ", e.target.viewCount.value);
        console.log("available: ", this.state.checkboxAvailableChecked);
        console.log("special: ", this.state.checkboxSpecialChecked);
        console.log("dateIn: ", e.target.dateIn.value);
        console.log("dateUpdate: ", e.target.dateUpdate.value);
        console.log("description: ", e.target.description.value);
        console.log("specification: ", e.target.specification.value);
        console.log("photo: ", e.target.photo.value);
    }

    onImageChange = event => {
        if (event.target.files && event.target.files[0]) {
            let img = event.target.files[0];
            this.setState({
                image: URL.createObjectURL(img)
            });
        }
    };

    handleAvailableChange(event) {
        this.setState({ checkboxAvailableChecked: event.target.checked })
    }

    handleSpecialChange(event) {
        this.setState({ checkboxSpecialChecked: event.target.checked })
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
                                <Input type="number" step="0.1" name="unitPrice" id="unitPrice" placeholder="Unit price" min="1" />
                            </FormGroup>
                        </Col>
                        <Col sm="2">
                            <FormGroup>
                                <Label for="discount">Discount</Label>
                                <Input type="number" step="0.1" name="discount" id="discount" placeholder="Discount" min="0" defaultValue="0" />
                            </FormGroup>
                        </Col>
                        <Col sm="2">
                            <FormGroup>
                                <Label for="quantity">Quantity</Label>
                                <Input type="number" name="quantity" id="quantity" placeholder="Quantity" min="0" defaultValue="0" />
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

                        <Col sm="3" style={{ marginTop: "2rem" }}>
                            <Button color="success">Add</Button>
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

                        <Col sm="3" style={{ marginTop: "2rem" }}>
                            <Button color="success">Add</Button>
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

                        <Col sm="3">
                            <FormGroup>
                                <Label for="dateIn">Date In</Label>
                                <Input
                                    type="date"
                                    name="dateIn"
                                    id="dateIn"
                                    placeholder="date placeholder"
                                    defaultValue={new Date().toLocaleDateString()}
                                />
                            </FormGroup>
                        </Col>

                        <Col sm="3">
                            <FormGroup>
                                <Label for="dateUpdate">Date Update</Label>
                                <Input
                                    type="date"
                                    name="dateUpdate"
                                    id="dateUpdate"
                                    placeholder="date placeholder"
                                />
                            </FormGroup>
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

                    <Button style={{ marginTop: "2rem" }} color="primary">Submit</Button>
                </Form>
            </div>
        );
    }
}

export default BookGenerator;