import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText, Col, Row, CustomInput } from 'reactstrap';
import { endpointPublic, get, getWithAuth, endpointUser, putWithAuth, hostFrontend, endpointAdmin } from '../../components/HttpUtils';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { messages } from '../../components/message';
import CateModal from '../Category/CateModal';
import BrandModal from '../Brand/BrandModal';
import ManufacturerModal from '../Manufacturer/ManufacturerModal';
import { useParams } from 'react-router';

toast.configure();
const ProductUpdater = () => {
    const { id } = useParams();
    const [brandList, setBrandList] = useState([]);
    const [manufacturerList, setManufacturerList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [errors, setErrors] = useState({});
    const [base64Str, setBase64Str] = useState("");

    const [product, setProduct] = useState({});
    const [uploadImage, setUploadImage] = useState(null);
    const [checkboxAvailableChecked, setCheckboxAvailableChecked] = useState(true);
    const [checkboxSpecialChecked, setCheckboxSpecialChecked] = useState(false);

    const [unitPrice, setUnitPrice] = useState(1000);
    const [quantity, setQuantity] = useState(1);
    const [discount, setDiscount] = useState(0);
    const [viewCount, setViewCount] = useState(1);
    const [productName, setProductName] = useState("");
    const [description, setDescription] = useState("")
    const [specification, setSpecification] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [manufacturerName, setManufacturerName] = useState("");
    const [brandName, setBrandName] = useState("");
    const [resultCateModal, setResultCateModal] = useState(false);
    const [resultBrandModal, setResultBrandModal] = useState(false);
    const [resultManufacturerModal, setResultManufacturerModal] = useState(false);
    const [productType, setProductType] = useState('1');

    const [warranty, setWarranty] = useState(0);
    const [label, setLabel] = useState(1);
    const [imeiNo, setImeiNo] = useState("");
    const [model, setModel] = useState("");
    const [functions, setFunctions] = useState("");
    const [compatible, setCompatible] = useState("");
    const [type, setType] = useState();

    const fetchAllManufacturers = () => {
        getWithAuth(endpointPublic + "/manufacturers").then((response) => {
            if (response.status === 200) {
                setManufacturerList(response.data);
            }
        }).catch((error) => console.log("Fetching manufacturers error: " + error))
    }

    const fetchAllBrands = () => {
        getWithAuth(endpointPublic + "/brands").then((response) => {
            if (response.status === 200) {
                setBrandList(response.data);
            }
        }).catch((error) => console.log("Fetching brands error: " + error))
    }

    const fetchCategories = () => {
        get(endpointPublic + "/categories").then((response) => {
            if (response.status === 200) {
                setCategoryList(response.data);
            }
        })
    }

    const fetchProductById = (id) => {
        get(endpointPublic + "/products/" + id).then((response) => {
            if (response.status === 200) {
                setProduct(response.data);
                setCheckboxAvailableChecked(response.data.available);
                setCheckboxSpecialChecked(response.data.special);
                setProductName(response.data.productName);
                setUnitPrice(response.data.unitPrice);
                setDiscount(response.data.discount);
                setQuantity(response.data.quantity);
                setViewCount(response.data.viewCount);
                setDescription(response.data.description);
                setSpecification(response.data.specification);
                setWarranty(response.data.warranty);
                setLabel(response.data.label);
                setModel(response.data.model);
                setImeiNo(response.data.imeiNo);
                setFunctions(response.data.functions);
                setCompatible(response.data.compatibleDevices);
                setCategoryName(response.data.categoryName);
                setManufacturerName(response.data.manufacturerName);
                setBrandName(response.data.brandName);
                setType(response.data.type);
            }
        }).catch((error) => console.log("Fetching book by id error: " + error))
    }

    useEffect(() => {
        fetchAllManufacturers();
        fetchAllBrands();
        fetchCategories();
        fetchProductById(id);

        if (resultCateModal === true)
            fetchCategories();

        if (resultBrandModal === true)
            fetchAllBrands()

        if (resultManufacturerModal === true)
            fetchAllManufacturers()
    }, [resultCateModal, resultBrandModal, resultManufacturerModal]);

    const updateProduct = (e) => {
        e.preventDefault();
        if (!validateForm(e.target.productName.value.trim(), e.target.unitPrice.value))
            return;

        let image;
        if (uploadImage === null)
            image = product.image;
        else
            image = getByteaFromBase64Str(base64Str);

        let productBody = {
            "productName": e.target.productName.value.trim(),
            "unitPrice": e.target.unitPrice.value,
            "quantity": e.target.quantity.value,
            "discount": e.target.discount.value,
            "image": image,
            "description": description,
            "specification": specification,
            "viewCount": e.target.viewCount.value,
            "special": checkboxSpecialChecked,
            "available": checkboxAvailableChecked,
            "warranty": e.target.warranty.value,
            "label": e.target.label.value,
            "categoryName": e.target.category.value,
            "manufacturerName": e.target.manufacturer.value,
            "brandName": e.target.brand.value
        }
        let endpoint = endpointAdmin + "/products";
        if (productType === '1') {
            productBody['model'] = e.target.model.value;
            productBody['imeiNo'] = e.target.imei.value;
            endpoint += "/phones/";
        }
        else if (productType === '2') {
            productBody['compatibleDevices'] = e.target.compatible.value;
            productBody['functions'] = e.target.functions.value;
            endpoint += "/accessories/";
        }

        console.log(JSON.stringify(productBody));
        setProduct(productBody);

        putWithAuth(endpoint + id, productBody).then((response) => {
            if (response.status === 200 || response.status === 201) {
                console.log(messages.updateSuccess);
                toast.success(messages.updateSuccess, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000,
                });

                setTimeout(function () {
                    window.location.replace(hostFrontend + "admin/products");
                }, 2000);
            }
        }).catch(error => {
            toast.error(messages.insertFailed, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
            });
            console.log("error updating product: " + error);
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

    const validateForm = (name, price) => {
        let errors = {}, formIsValid = true;
        if (name.length < 6 || name.length > 250) {
            errors["name"] = messages.productNameLength;
            formIsValid = false;
        }
        if (price < 1000) {
            errors["price"] = messages.productPrice;
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
            <h2>CẬP NHẬT DỮ LIỆU SẢN PHẨM</h2>
            <Form style={{ marginTop: "2.5rem" }} onSubmit={(e) => updateProduct(e)}>
                <Row>
                    {/* <Col sm="6">
                        <FormGroup>
                            <strong>
                                <Label for="typeSelect">Chọn loại sản phẩm để cập nhật</Label>
                            </strong>
                            <Input type="select" name="type" id="typeSelect"
                                onChange={e => setProductType(e.target.value)}
                                style={{ width: "8rem" }}>
                                <option key={1} value={1} >Phone</option>
                                <option key={2} value={2} >Accessory</option>
                            </Input>
                        </FormGroup>
                    </Col> */}

                    <Col sm="3">
                        <FormGroup>
                            <strong><Label for="model">Model</Label></strong>
                            <Input type="text" name="model" id="model" placeholder="Model"
                                required disabled={type !== 1} value={model}
                                onChange={e => setModel(e.target.value)} />
                            <span style={{ color: "red" }}>{errors["model"]}</span>
                        </FormGroup>
                    </Col>

                    <Col sm="3">
                        <FormGroup>
                            <strong><Label for="imei">IMEI No</Label></strong>
                            <Input type="text" name="imei" id="imei" placeholder="imei" required readOnly={true}
                                maxLength={15} disabled={type !== 1} value={imeiNo}
                                onChange={e => setImeiNo(e.target.value)} />
                            <span style={{ color: "red" }}>{errors["imei"]}</span>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col sm="6">
                        <FormGroup>
                            <strong><Label for="productName">Tên sản phẩm</Label></strong>
                            <Input type="text" name="productName" id="productName"
                                onChange={e => setProductName(e.target.value)}
                                placeholder="Tên sản phẩm" required value={productName} />
                            <span style={{ color: "red" }}>{errors["name"]}</span>
                        </FormGroup>
                    </Col>

                    <Col sm="2">
                        <FormGroup>
                            <strong><Label for="unitPrice">Đơn giá</Label></strong>
                            <Input type="number" step="0.01" name="unitPrice" required value={unitPrice}
                                id="unitPrice" placeholder="Đơn giá" min="1000" defaultValue="1000"
                                onChange={e => setUnitPrice(e.target.value)} />
                            <span style={{ color: "red" }}>{errors["price"]}</span>
                        </FormGroup>
                    </Col>
                    <Col sm="2">
                        <FormGroup>
                            <strong><Label for="discount">Giảm giá</Label></strong>
                            <Input type="number" step="0.001" name="discount" id="discount" value={discount}
                                onChange={e => setDiscount(e.target.value)}
                                placeholder="Giảm giá" min="0" max="1" defaultValue="0" />
                        </FormGroup>
                    </Col>
                    <Col sm="2">
                        <FormGroup>
                            <strong><Label for="quantity">Số lượng</Label></strong>
                            <Input type="number" name="quantity" id="quantity" placeholder="Số lượng"
                                min="1" defaultValue="1" value={quantity}
                                onChange={e => setQuantity(e.target.value)} />
                        </FormGroup>
                    </Col>
                </Row>

                <Row>
                    <Col>
                        <FormGroup>
                            <strong><Label for="warranty">Bảo hành</Label></strong>
                            <Input type="number" name="warranty" id="warranty" placeholder="Bảo hành"
                                min="0" max="36" defaultValue="0" value={warranty}
                                onChange={e => setWarranty(e.target.value)} />
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <strong><Label for="label">Label</Label></strong>
                            <Input type="number" name="label" id="label" placeholder="Label" min="1"
                                defaultValue="1" value={label}
                                onChange={e => setLabel(e.target.value)} />
                        </FormGroup>
                    </Col>
                </Row>

                <Row>
                    <Col sm="9">
                        <FormGroup>
                            <strong><Label for="categorySelect">Chọn loại sản phẩm</Label></strong>
                            <Input type="select" name="category" id="categorySelect">
                                {categoryList.map((cate) => (
                                    <option key={cate.categoryId}
                                        selected={categoryName === cate.categoryName}
                                    >{cate.categoryName}</option>
                                ))}
                            </Input>
                        </FormGroup>
                    </Col>

                    <Col sm="3" style={{ marginTop: "1rem" }}>
                        <CateModal
                            buttonLabel="Thêm mới thể loại hàng"
                            className="insert-button"
                            title="Thêm mới thể loại hàng"
                            color="success"
                            categoryId=""
                            categoryName=""
                            description=""
                            getResultInModal={getResultInCateModal}
                            insertable={true}
                            external={true}>
                            Thêm mới thể loại hàng</CateModal>
                    </Col>
                </Row>

                <Row>
                    <Col sm="9">
                        <FormGroup>
                            <strong><Label for="manufacturerSelect">Chọn nhà sản xuất</Label></strong>
                            <Input type="select" name="manufacturer" id="manufacturerSelect">
                                {manufacturerList.map((man) => (
                                    <option key={man.manufacturerId}
                                        selected={manufacturerName === man.manufacturerName}
                                    >{man.manufacturerName}</option>
                                ))}
                            </Input>
                        </FormGroup>
                    </Col>

                    <Col sm="3" style={{ marginTop: "1.2rem" }}>
                        <ManufacturerModal
                            buttonLabel="Thêm mới nhà sản xuất "
                            className="insert-button"
                            title="Thêm mới nhà sản xuất"
                            color="success"
                            manufacturerId=""
                            manufacturerName=""
                            email=""
                            address=""
                            phoneNumber=""
                            country=""
                            getResultInModal={getResultInManufacturerModal}
                            insertable={true}
                            external={true}>
                            Thêm mới nhà sản xuất</ManufacturerModal>
                    </Col>
                </Row>

                <Row>
                    <Col sm="9">
                        <FormGroup>
                            <strong><Label for="brandSelect">Chọn thương hiệu</Label></strong>
                            <Input type="select" name="brand" id="brandSelect">
                                {brandList.map((brand) => (
                                    <option key={brand.brandId}
                                        selected={brandName === brand.brandName}
                                    >{brand.brandName}</option>
                                ))}
                            </Input>
                        </FormGroup>
                    </Col>

                    <Col sm="3" style={{ marginTop: "2rem" }}>
                        <BrandModal
                            buttonLabel="Thêm mới thương hiệu"
                            className="insert-button"
                            title="Thêm mới thương hiệu"
                            color="success"
                            brandId=""
                            brandName=""
                            country=""
                            description=""
                            getResultInModal={getResultInBrandModal}
                            insertable={true}
                            external={true}>
                            Thêm mới thương hiệu</BrandModal>
                    </Col>
                </Row>

                <Row>
                    <Col sm="2">
                        <strong><Label for="viewCount">Lượt xem</Label></strong>
                        <Input type="number" name="viewCount" id="viewCount" placeholder="No. views"
                            min="0" defaultValue="0" value={viewCount}
                            onChange={e => setViewCount(e.target.value)} />
                    </Col>

                    <Col sm="2">
                        <strong><Label for="available">Tình trạng tốt</Label></strong>
                        <div>
                            <CustomInput type="checkbox" id="availableCheckbox" label="Available" name="available" defaultChecked={checkboxAvailableChecked}
                                checked={checkboxAvailableChecked} onChange={(e) => handleAvailableChange(e)} />
                        </div>
                    </Col>

                    <Col sm="2">
                        <strong><Label for="special">Hàng đặc biệt</Label></strong>
                        <div>
                            <CustomInput type="checkbox" name="special" id="specialCheckbox" label="special" defaultChecked={checkboxSpecialChecked}
                                checked={checkboxSpecialChecked} onChange={(e) => handleSpecialChange(e)}
                            />
                        </div>
                    </Col>
                </Row>

                <Row>
                    <Col sm="6">
                        <FormGroup>
                            <strong><Label for="functions">Chức năng hỗ trợ</Label></strong>
                            <Input type="text" name="functions" id="functions" placeholder="functions"
                                required disabled={type !== 2} value={functions}
                                onChange={e => setFunctions(e.target.value)} />
                            <span style={{ color: "red" }}>{errors["functions"]}</span>
                        </FormGroup>
                    </Col>
                    <Col sm="6">
                        <FormGroup>
                            <strong><Label for="compatible">Khả năng tương thích</Label></strong>
                            <Input type="text" name="compatible" id="compatible" placeholder="compatible"
                                required disabled={type !== 2} value={compatible}
                                onChange={e => setCompatible(e.target.value)} />
                            <span style={{ color: "red" }}>{errors["compatible"]}</span>
                        </FormGroup>
                    </Col>
                </Row>

                <FormGroup>
                    <strong><Label for="description">Mô tả</Label></strong>
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
                    <strong><Label for="specification">Thông số kỹ thuật</Label></strong>
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
                    <strong><Label for="photoFile">Ảnh</Label></strong>
                    <Input type="file" name="photo" id="photoFile" accept="image/*" onChange={(e) => onImageChange(e)} />
                    <FormText color="muted">
                        Upload ảnh
                    </FormText>
                    {uploadImage !== null ?
                        <img src={uploadImage} width="300" height="250" alt="No image" />
                        :
                        <img src={`data:image/jpeg;base64,${product.image}`} width="300" height="250" alt="No image" />
                    }
                </FormGroup>

                <Button style={{ marginTop: "2rem" }} color="primary">CẬP NHẬT</Button>
            </Form>
        </div>
    );
}

export default ProductUpdater;