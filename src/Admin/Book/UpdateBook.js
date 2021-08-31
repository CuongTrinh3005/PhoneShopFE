import React, { useState, useEffect } from 'react';
import { useParams, withRouter } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input, FormText, Col, Row, CustomInput } from 'reactstrap';
import { endpointPublic, get, getWithAuth, endpointUser, putWithAuth, hostFrontend } from '../../components/HttpUtils';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { messages } from '../../components/message';
import CateModal from '../Category/CateModal';
import AuthorModal from '../Author/AuthorModal';
import PublisherModal from '../Publisher/PublisherModal';

toast.configure();
const BookUpdater = () => {
    const { id } = useParams();
    const [authorList, setAuthorList] = useState([]);
    const [publisherList, setPublisherList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [checkedAuthorId, setCheckedAuthorId] = useState([]);
    const [uploadImage, setUploadImage] = useState(null);
    const [checkboxAvailableChecked, setCheckboxAvailableChecked] = useState(true);
    const [checkboxSpecialChecked, setCheckboxSpecialChecked] = useState(false);
    const [base64Str, setBase64Str] = useState("");
    const [book, setBook] = useState({});
    const [bookName, setBookName] = useState("");
    const [unitPrice, setUnitPrice] = useState(1000);
    const [quantity, setQuantity] = useState(1);
    const [discount, setDiscount] = useState(0);
    const [viewCount, setViewCount] = useState(1);
    const [errors, setErrors] = useState({});
    const [description, setDescription] = useState("")
    const [specification, setSpecification] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [publisherName, setPublisherName] = useState("");
    const [authorIds, setAuthorIds] = useState([]);
    const [resultCateModal, setResultCateModal] = useState(false);
    const [resultAuthorModal, setResultAuthorModal] = useState(false);
    const [resultPublisherModal, setResultPublisherModal] = useState(false);

    const fetchBookById = () => {
        get(endpointPublic + "/books/" + id).then((response) => {
            if (response.status === 200) {
                setBook(response.data);
                setCheckedAuthorId(response.data.authorIds);
                setCheckboxAvailableChecked(response.data.available);
                setCheckboxSpecialChecked(response.data.special);
                setBookName(response.data.bookName);
                setUnitPrice(response.data.unitPrice);
                setDiscount(response.data.discount);
                setQuantity(response.data.quantity);
                setViewCount(response.data.viewCount);
                setDescription(response.data.description);
                setSpecification(response.data.specification);
                setCategoryName(response.data.categoryName);
                setPublisherName(response.data.publisherName);
                setAuthorIds(response.data.authorIds);
            }
        }).catch((error) => console.log("Fetching book by id error: " + error))
    }

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
        fetchBookById();

        if (resultCateModal === true)
            fetchCategories();

        if (resultAuthorModal === true)
            fecthAllAuthors()

        if (resultPublisherModal === true)
            fecthAllPublishers()
    }, [resultCateModal, resultAuthorModal, resultPublisherModal]);

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

    const updateBook = (e) => {
        e.preventDefault();
        if (!validateForm(e.target.bookName.value.trim(), e.target.unitPrice.value, checkedAuthorId.length))
            return;

        let photo;
        if (uploadImage === null)
            photo = book.photo;
        else
            photo = getByteaFromBase64Str(base64Str);

        const bookBody = {
            "bookName": e.target.bookName.value.trim(),
            "unitPrice": e.target.unitPrice.value,
            "quantity": e.target.quantity.value,
            "discount": e.target.discount.value,
            "photo": photo,
            "description": description,
            "specification": specification,
            "viewCount": e.target.viewCount.value,
            "special": checkboxSpecialChecked,
            "available": checkboxAvailableChecked,
            "categoryName": e.target.category.value,
            "publisherName": e.target.publisher.value,
            "authorIds": checkedAuthorId
        }
        console.log(JSON.stringify(bookBody));

        putWithAuth(endpointUser + "/books/" + id, bookBody).then((response) => {
            if (response.status === 200 || response.status === 201) {
                toast.success(messages.updateSuccess, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000,
                });

                setTimeout(function () {
                    window.location.replace(hostFrontend + "admin/books");
                }, 2000);

                console.log("Update book successfully!");
                setBook(bookBody);
            }
        }).catch(error => {
            toast.error(messages.updateFailed + error.response.data.message, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
            });
            console.log("error updating book: " + error);
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
            setUploadImage(URL.createObjectURL(img))
            getBase64(event.target.files[0], (result) => {
                setBase64Str(result);
            });
        }
    };

    const handleAvailableChange = (event) => {
        setCheckboxAvailableChecked(event.target.checked);
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

    const getResultInAuthorModal = (result) => {
        setResultAuthorModal(result);
    }

    const getResultInPublisherModal = (result) => {
        setResultPublisherModal(result);
    }

    return (
        <div>
            <h2>CẬP NHẬT THÔNG TIN SÁCH</h2>
            <Form style={{ marginTop: "2.5rem" }} onSubmit={(e) => updateBook(e)}>
                <Row>
                    <Col sm="6">
                        <FormGroup>
                            <Label for="bookName">Tên sách</Label>
                            <Input type="text" name="bookName" id="bookName" placeholder="Nhập tên sách" required
                                value={bookName}
                                onChange={e => setBookName(e.target.value)} />
                            <span style={{ color: "red" }}>{errors["name"]}</span>
                        </FormGroup>
                    </Col>

                    <Col sm="2">
                        <FormGroup>
                            <Label for="unitPrice">Đơn giá</Label>
                            <Input type="number" step="0.01" required
                                name="unitPrice" id="unitPrice" placeholder="Đơn giá" min="1000" defaultValue="1000"
                                value={unitPrice} min="1000"
                                onChange={e => setUnitPrice(e.target.value)} />
                            <span style={{ color: "red" }}>{errors["price"]}</span>
                        </FormGroup>
                    </Col>
                    <Col sm="2">
                        <FormGroup>
                            <Label for="discount">Giảm giá</Label>
                            <Input type="number" step="0.001" name="discount" id="discount" placeholder="Giảm giá"
                                min="0" max="1" defaultValue="0" value={discount}
                                onChange={e => setDiscount(e.target.value)} />
                        </FormGroup>
                    </Col>
                    <Col sm="2">
                        <FormGroup>
                            <Label for="quantity">Số lượng</Label>
                            <Input type="number" name="quantity" id="quantity"
                                placeholder="Số lượng" min="1" defaultValue="1" value={quantity}
                                onChange={e => setQuantity(e.target.value)} />
                        </FormGroup>
                    </Col>
                </Row>

                <Row>
                    <Col sm="9">
                        <FormGroup>
                            <Label for="categorySelect">Chọn thể loại sách</Label>
                            <Input type="select" name="category" id="categorySelect">
                                {categoryList.map((cate) => (
                                    <option key={cate.categoryId}
                                        selected={categoryName === cate.categoryName}
                                    >{cate.categoryName}
                                    </option>
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
                                    <option key={pub.publisherId}
                                        selected={publisherName === pub.publisherName}>
                                        {pub.publisherName}
                                    </option>
                                ))}
                            </Input>
                        </FormGroup>
                    </Col>

                    <Col sm="3" style={{ marginTop: "1.2rem" }}>
                        <PublisherModal
                            buttonLabel="Thêm mới nhà XB "
                            className="insert-button"
                            title="Thêm mới nhà xuất bản"
                            color="success"
                            publisherId=""
                            publisherName=""
                            address=""
                            phoneNumber=""
                            getResultInModal={getResultInPublisherModal}
                            insertable={true}
                            external={true}>
                            Thêm mới nhà xuất bản</PublisherModal>
                    </Col>
                </Row>

                <Row>
                    <Col sm="9">
                        <FormGroup>
                            <Label for="authorSelectMulti">Chọn tác giả</Label>
                            <Input type="select" name="authors" multiple id="authorSelectMulti" onChange={(event) => { handleCheckboxChange(event) }}>
                                {authorList.map((author) => (
                                    <option key={author.authorId}
                                        value={author.authorId}
                                        selected={authorIds.includes(author.authorId.toString())}
                                    >{author.authorName}
                                    </option>
                                ))}
                            </Input>
                            <span style={{ color: "red" }}>{errors["authors"]}</span>
                        </FormGroup>
                    </Col>

                    <Col sm="3" style={{ marginTop: "2rem" }}>
                        <AuthorModal
                            buttonLabel="Thêm mới tác giả"
                            className="insert-button"
                            title="Thêm mới tác giả"
                            color="success"
                            authorId=""
                            authorName=""
                            address=""
                            phoneNumber=""
                            getResultInModal={getResultInAuthorModal}
                            insertable={true}
                            external={true}>
                            Thêm mới tác giả</AuthorModal>
                    </Col>
                </Row>

                <Row>
                    <Col sm="2">
                        <Label for="viewCount">Lượt xem</Label>
                        <Input type="number" name="viewCount" id="viewCount"
                            placeholder="Lượt xem" min="0" defaultValue="0" value={viewCount}
                            onChange={e => setViewCount(e.target.value)} />
                    </Col>

                    <Col sm="2">
                        <Label for="available">Tình trạng tốt</Label>
                        <div>
                            <CustomInput type="checkbox" id="availableCheckbox" label="Available" name="available" defaultValue="true"
                                checked={checkboxAvailableChecked} onChange={(e) => handleAvailableChange(e)} />
                        </div>
                    </Col>

                    <Col sm="2">
                        <Label for="special">Hàng đặc biệt</Label>
                        <div>
                            <CustomInput type="checkbox" name="special" id="specialCheckbox" label="special" defaultValue="false"
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
                    {uploadImage !== null ?
                        <img src={uploadImage} width="200" height="100" alt="No image" />
                        :
                        <img src={`data:image/jpeg;base64,${book.photo}`} width="200" height="100" alt="No image" />
                    }
                </FormGroup>

                <Button style={{ marginTop: "2rem" }, { float: "right" }} color="primary">CẬP NHẬT</Button>
            </Form>
        </div>
    );
}

export default withRouter(BookUpdater);