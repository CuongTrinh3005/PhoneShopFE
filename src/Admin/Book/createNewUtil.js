import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText, Col, Row, CustomInput } from 'reactstrap';
import { endpointPublic, get, getWithAuth, endpointUser, postwithAuth, hostFrontend } from '../../components/HttpUtils';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { messages } from '../../components/message';
import ModalForm from '../Author/AuthorModal';

toast.configure();
class BookGenerator extends Component {
    state = {
        authorList: [], publisherList: [], categoryList: [], bookName: "", unitPrice: 1, quantity: 0,
        discount: 0, checkedAuthorId: [], image: null, checkboxAvailableChecked: true,
        checkboxSpecialChecked: false, base64Str: "", book: {}, errors: {}, description: '', specification: ''
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
            "description": this.state.description,
            "specification": this.state.specification,
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
                console.log(messages.insertSuccess);
                toast.success(messages.insertSuccess, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000,
                });

                setTimeout(function () {
                    window.location.replace(hostFrontend + "admin/books");
                }, 2000);
            }
        }).catch(error => {
            toast.error(messages.insertFailed, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
            });
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
        let errors = {}, formIsValid = true;
        if (name.length < 6 || name.length > 250) {
            errors["name"] = messages.bookNameLength;
            formIsValid = false;
        }
        if (price < 1000) {
            errors["price"] = messages.bookPrice;
            formIsValid = false;
        }
        if (authorsLength === 0) {
            errors["authors"] = messages.selectAuthor;
            formIsValid = false;
        }
        this.setState({ errors: errors });

        return formIsValid;
    }

    render() {
        return (
            <div>
                <h2>THÊM MỚI DỮ LIỆU SÁCH</h2>
                <Form style={{ marginTop: "2.5rem" }} onSubmit={(e) => this.createNewBook(e)}>
                    <Row>
                        <Col sm="6">
                            <FormGroup>
                                <Label for="bookName">Tên sách</Label>
                                <Input type="text" name="bookName" id="bookName" placeholder="Tên sách" required />
                                <span style={{ color: "red" }}>{this.state.errors["name"]}</span>
                            </FormGroup>
                        </Col>

                        <Col sm="2">
                            <FormGroup>
                                <Label for="unitPrice">Đơn giá</Label>
                                <Input type="number" step="0.01" name="unitPrice" required
                                    id="unitPrice" placeholder="Đơn giá" min="1000" defaultValue="1000" />
                                <span style={{ color: "red" }}>{this.state.errors["price"]}</span>
                            </FormGroup>
                        </Col>
                        <Col sm="2">
                            <FormGroup>
                                <Label for="discount">Giảm giá</Label>
                                <Input type="number" step="0.001" name="discount" id="discount" placeholder="Giảm giá" min="0" max="1" defaultValue="0" />
                            </FormGroup>
                        </Col>
                        <Col sm="2">
                            <FormGroup>
                                <Label for="quantity">Số lượng</Label>
                                <Input type="number" name="quantity" id="quantity" placeholder="Số lượng" min="1" defaultValue="1" />
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col sm="9">
                            <FormGroup>
                                <Label for="categorySelect">Chọn thể loại sách</Label>
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
                                <Label for="publisherSelect">Chọn nhà xuất bản</Label>
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
                                <Label for="authorSelectMulti">Chọn tác giả</Label>
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
                            <Label for="viewCount">Lượt xem</Label>
                            <Input type="number" name="viewCount" id="viewCount" placeholder="Unit price" min="0" defaultValue="0" />
                        </Col>

                        <Col sm="2">
                            <Label for="available">Tình trạng tốt</Label>
                            <div>
                                <CustomInput type="checkbox" id="availableCheckbox" label="Available" name="available" defaultChecked={this.state.checkboxAvailableChecked}
                                    checked={this.state.checkboxAvailableChecked} onChange={(e) => this.handleAvailableChange(e)} />
                            </div>
                        </Col>

                        <Col sm="2">
                            <Label for="special">Hàng đặc biệt</Label>
                            <div>
                                <CustomInput type="checkbox" name="special" id="specialCheckbox" label="special" defaultChecked={this.state.checkboxSpecialChecked}
                                    checked={this.state.checkboxSpecialChecked} onChange={(e) => this.handleSpecialChange(e)}
                                />
                            </div>
                        </Col>
                    </Row>

                    <FormGroup>
                        <Label for="description">Mô tả</Label>
                        <CKEditor id="description"
                            editor={ClassicEditor}
                            data={this.state.description}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                this.setState({ description: data });
                            }}
                        />
                    </FormGroup>
                    <FormGroup>
                        <Label for="specification">Thông số kỹ thuật</Label>
                        <CKEditor id="specification"
                            editor={ClassicEditor}
                            data={this.state.specification}
                            onChange={(event, editor) => {
                                const data = editor.getData();
                                this.setState({ specification: data });
                            }}
                        />
                    </FormGroup>

                    <br />
                    <FormGroup>
                        <Label for="photoFile">Ảnh</Label>
                        <Input type="file" name="photo" id="photoFile" accept="image/*" onChange={(e) => this.onImageChange(e)} />
                        <FormText color="muted">
                            Upload ảnh
                        </FormText>
                        <img src={this.state.image} width="200" height="100" />
                    </FormGroup>

                    <Button style={{ marginTop: "2rem" }} color="primary">THÊM MỚI</Button>
                </Form>
            </div>
        );
    }
}

export default BookGenerator;