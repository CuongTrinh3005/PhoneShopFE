import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText, Col, Row, CustomInput } from 'reactstrap';
import { endpointPublic, get, getWithAuth, endpointUser, postwithAuth, hostFrontend } from '../../components/HttpUtils';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { messages } from '../../components/message';
import CateModal from '../Category/CateModal';
import BrandModal from '../Brand/BrandModal';
import ManufacturerModal from '../Manufacturer/ManufacturerModal';

toast.configure();
const BookGenerator = () => {
    const [authorList, setAuthorList] = useState([]);
    const [publisherList, setPublisherList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [checkedAuthorId, setCheckedAuthorId] = useState([]);
    const [image, setImage] = useState(null);
    const [checkboxAvailableChecked, setCheckboxAvailableChecked] = useState(true);
    const [checkboxSpecialChecked, setCheckboxSpecialChecked] = useState(false);
    const [base64Str, setBase64Str] = useState("");
    const [book, setBook] = useState({});
    const [errors, setErrors] = useState({});
    const [description, setDescription] = useState("")
    const [specification, setSpecification] = useState("");
    const [resultCateModal, setResultCateModal] = useState(false);
    const [resultBrandModal, setResultBrandModal] = useState(false);
    const [resultManufacturerModal, setResultManufacturerModal] = useState(false);

    const fecthAllPublishers = () => {
        getWithAuth(endpointUser + "/publishers").then((response) => {
            if (response.status === 200) {
                setPublisherList(response.data);
            }
        }).catch((error) => console.log("Fetching publishers error: " + error))
    }

    const fecthAllAuthors = () => {
        getWithAuth(endpointUser + "/authors").then((response) => {
            if (response.status === 200) {
                setAuthorList(response.data);
            }
        }).catch((error) => console.log("Fetching authors error: " + error))
    }

    const fetchCategories = () => {
        get(endpointPublic + "/categories").then((response) => {
            if (response.status === 200) {
                setCategoryList(response.data);
            }
        })
    }


    useEffect(() => {
        fecthAllPublishers();
        fecthAllAuthors();
        fetchCategories();

        if (resultCateModal === true)
            fetchCategories();

        if (resultBrandModal === true)
            fecthAllAuthors()

        if (resultManufacturerModal === true)
            fecthAllPublishers()
    }, [resultCateModal, resultBrandModal, resultManufacturerModal]);

    const handleCheckboxChange = (event) => {
        let options = [], option;
        for (let i = 0, len = event.target.options.length; i < len; i++) {
            option = event.target.options[i];
            if (option.selected) {
                options.push(option.value);
            }
        }
        setCheckedAuthorId(options);
    }

    const createNewBook = (e) => {
        e.preventDefault();
        if (!validateForm(e.target.bookName.value.trim(), e.target.unitPrice.value,
            checkedAuthorId.length))
            return;

        const bookBody = {
            "bookName": e.target.bookName.value.trim(),
            "unitPrice": e.target.unitPrice.value,
            "quantity": e.target.quantity.value,
            "discount": e.target.discount.value,
            "photo": getByteaFromBase64Str(base64Str),
            "description": description,
            "specification": specification,
            "viewCount": e.target.viewCount.value,
            "special": checkboxSpecialChecked,
            "available": checkboxAvailableChecked,
            "categoryName": e.target.category.value,
            "publisherName": e.target.publisher.value,
            "authorIds": checkedAuthorId
        }
        console.log(bookBody);
        setBook(bookBody);

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

    const getByteaFromBase64Str = () => {
        if (base64Str !== "") {
            const byteArr = base64Str.split(",");
            return byteArr[1];
        }
    }

    const onImageChange = event => {
        if (event.target.files && event.target.files[0]) {
            let img = event.target.files[0];
            setImage(URL.createObjectURL(img))
            getBase64(event.target.files[0], (result) => {
                setBase64Str(result);
            });
        }
    };

    const handleAvailableChange = (event) => {
        setCheckboxAvailableChecked(event.target.checked)
    }

    const handleSpecialChange = (event) => {
        setCheckboxSpecialChecked(event.target.checked);
    }

    const getBase64 = (file, cb) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            cb(reader.result)
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }

    const validateForm = (name, price, authorsLength) => {
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
        setErrors(errors);

        return formIsValid;
    }

    const getResultInCateModal = (result) => {
        setResultCateModal(result);
    }

    const getResultInBrandModal = (result) => {
        setResultBrandModal(result);
    }

    const getResultInManufacturerModal = (result) => {
        setResultManufacturerModal(result);
    }

    return (
        <div>
            <h2>THÊM MỚI DỮ LIỆU SÁCH</h2>
            <Form style={{ marginTop: "2.5rem" }} onSubmit={(e) => createNewBook(e)}>
                <Row>
                    <Col sm="6">
                        <FormGroup>
                            <Label for="bookName">Tên sách</Label>
                            <Input type="text" name="bookName" id="bookName" placeholder="Tên sách" required />
                            <span style={{ color: "red" }}>{errors["name"]}</span>
                        </FormGroup>
                    </Col>

                    <Col sm="2">
                        <FormGroup>
                            <Label for="unitPrice">Đơn giá</Label>
                            <Input type="number" step="0.01" name="unitPrice" required
                                id="unitPrice" placeholder="Đơn giá" min="1000" defaultValue="1000" />
                            <span style={{ color: "red" }}>{errors["price"]}</span>
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
                                {categoryList.map((cate) => (
                                    <option key={cate.categoryId}>{cate.categoryName}</option>
                                ))}
                            </Input>
                        </FormGroup>
                    </Col>

                    <Col sm="3" style={{ marginTop: "1rem" }}>
                        <CateModal
                            buttonLabel="Thêm mới thể loại"
                            className="insert-button"
                            title="Thêm mới thể loại"
                            color="success"
                            categoryId=""
                            categoryName=""
                            description=""
                            getResultInModal={getResultInCateModal}
                            insertable={true}
                            external={true}>
                            Thêm mới thể loại</CateModal>

                    </Col>
                </Row>

                <Row>
                    <Col sm="9">
                        <FormGroup>
                            <Label for="publisherSelect">Chọn nhà xuất bản</Label>
                            <Input type="select" name="publisher" id="publisherSelect">
                                {publisherList.map((pub) => (
                                    <option key={pub.publisherId}>{pub.publisherName}</option>
                                ))}
                            </Input>
                        </FormGroup>
                    </Col>

                    <Col sm="3" style={{ marginTop: "1.2rem" }}>
                        <ManufacturerModal
                            buttonLabel="Thêm mới nhà XB "
                            className="insert-button"
                            title="Thêm mới nhà xuất bản"
                            color="success"
                            publisherId=""
                            publisherName=""
                            address=""
                            phoneNumber=""
                            getResultInModal={getResultInManufacturerModal}
                            insertable={true}
                            external={true}>
                            Thêm mới nhà xuất bản</ManufacturerModal>
                    </Col>
                </Row>

                <Row>
                    <Col sm="9">
                        <FormGroup>
                            <Label for="authorSelectMulti">Chọn tác giả</Label>
                            <Input type="select" name="authors" multiple id="authorSelectMulti" onChange={(event) => { handleCheckboxChange(event) }}>
                                {authorList.map((author) => (
                                    <option key={author.authorId} value={author.authorId}>{author.authorName}</option>
                                ))}
                            </Input>
                            <span style={{ color: "red" }}>{errors["authors"]}</span>
                        </FormGroup>
                    </Col>

                    <Col sm="3" style={{ marginTop: "2rem" }}>
                        <BrandModal
                            buttonLabel="Thêm mới tác giả"
                            className="insert-button"
                            title="Thêm mới tác giả"
                            color="success"
                            authorId=""
                            authorName=""
                            address=""
                            phoneNumber=""
                            getResultInModal={getResultInBrandModal}
                            insertable={true}
                            external={true}>
                            Thêm mới tác giả</BrandModal>
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
                            <CustomInput type="checkbox" id="availableCheckbox" label="Available" name="available" defaultChecked={checkboxAvailableChecked}
                                checked={checkboxAvailableChecked} onChange={(e) => handleAvailableChange(e)} />
                        </div>
                    </Col>

                    <Col sm="2">
                        <Label for="special">Hàng đặc biệt</Label>
                        <div>
                            <CustomInput type="checkbox" name="special" id="specialCheckbox" label="special" defaultChecked={checkboxSpecialChecked}
                                checked={checkboxSpecialChecked} onChange={(e) => handleSpecialChange(e)}
                            />
                        </div>
                    </Col>
                </Row>

                <FormGroup>
                    <Label for="description">Mô tả</Label>
                    <CKEditor id="description"
                        editor={ClassicEditor}
                        data={description}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            setDescription(data);
                        }}
                    />
                </FormGroup>
                <FormGroup>
                    <Label for="specification">Thông số kỹ thuật</Label>
                    <CKEditor id="specification"
                        editor={ClassicEditor}
                        data={specification}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            setSpecification(data);
                        }}
                    />
                </FormGroup>

                <br />
                <FormGroup>
                    <Label for="photoFile">Ảnh</Label>
                    <Input type="file" name="photo" id="photoFile" accept="image/*" onChange={(e) => onImageChange(e)} />
                    <FormText color="muted">
                        Upload ảnh
                    </FormText>
                    <img src={image} alt="No image" width="200" height="100" />
                </FormGroup>

                <Button style={{ marginTop: "2rem" }} color="primary">THÊM MỚI</Button>
            </Form>
        </div>
    );
}

export default BookGenerator;