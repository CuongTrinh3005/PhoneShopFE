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
    const [checkboxWifiChecked, setCheckboxWifiChecked] = useState(true);
    const [checkboxBluetoothChecked, setCheckboxBluetoothChecked] = useState(true);
    const [checkboxTouchScreenChecked, setCheckboxTouchScreenChecked] = useState(true);

    const [unitPrice, setUnitPrice] = useState(1000);
    const [quantity, setQuantity] = useState(1);
    const [discount, setDiscount] = useState(0);
    const [viewCount, setViewCount] = useState(1);
    const [productName, setProductName] = useState("");
    const [description, setDescription] = useState("")
    const [categoryName, setCategoryName] = useState("");
    const [manufacturerName, setManufacturerName] = useState("");
    const [brandName, setBrandName] = useState("");
    const [resultCateModal, setResultCateModal] = useState(false);
    const [resultBrandModal, setResultBrandModal] = useState(false);
    const [resultManufacturerModal, setResultManufacturerModal] = useState(false);
    // const [productType, setProductType] = useState('1');

    const [warranty, setWarranty] = useState(0);
    const [type, setType] = useState(1);
    const [commonCoef, setCommonCoef] = useState(0);
    const [gamingCoef, setGamingCoef] = useState(0);
    const [entertainCoef, setEntertainCoef] = useState(0);
    const [imeiNo, setImeiNo] = useState("");
    const [model, setModel] = useState("");
    const [ram, setRam] = useState(2);
    const [batteryPower, setBatteryPower] = useState(1000);
    const [inMemory, setInMemory] = useState(32);
    const [touchScreen, setTouchScreen] = useState(false);
    const [wifi, setWifi] = useState(false);
    const [bluetooth, setBluetooth] = useState(false);
    const [clockSpeed1, setClockSpeed1] = useState(1.3);
    const [clockSpeed2, setClockSpeed2] = useState(0);
    const [clockSpeed3, setClockSpeed3] = useState(0);
    const [nCores1, setNCores1] = useState(1);
    const [nCores2, setNCores2] = useState(0);
    const [nCores3, setNCores3] = useState(0);
    const [nSims, setNsims] = useState(1);
    const [pxHeight, setPxHeight] = useState(0);
    const [pxWidth, setPxWidth] = useState(0);
    const [screenHeight, setScreenHeight] = useState(0);
    const [screenWidth, setScreenWidth] = useState(0);
    const [refreshRate, setRefreshRate] = useState(120);
    const [frontCam1, setFrontCam1] = useState(4);
    const [frontCam2, setFrontCam2] = useState(0);
    const [backCam, setBackCam] = useState("");
    const [support_3G, setSupport3G] = useState(true);
    const [support_4G, setSupport4G] = useState(false);
    const [support_5G, setSupport5G] = useState(false);
    const [otherSpecification, setOtherSpecification] = useState("");

    const [functions, setFunctions] = useState("");
    const [compatible, setCompatible] = useState("");

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
                setWarranty(response.data.warranty);
                setType(response.data.type);
                setCommonCoef(response.data.commonCoef);
                setGamingCoef(response.data.gamingCoef);
                setEntertainCoef(response.data.entertainCoef);

                if (response.data.type === 1) {
                    setModel(response.data.model);
                    setImeiNo(response.data.imeiNo);
                    setRam(response.data.ram);
                    setBatteryPower(response.data.batteryPower);
                    setInMemory(response.data.inMemory);
                    setTouchScreen(response.data.touchScreen);
                    setWifi(response.data.wifi);
                    setBluetooth(response.data.bluetooth);
                    setClockSpeed1(response.data.clockSpeed1);
                    setClockSpeed2(response.data.clockSpeed2);
                    setClockSpeed3(response.data.clockSpeed3);
                    setNCores1(response.data.n_cores1);
                    setNCores2(response.data.n_cores2);
                    setNCores3(response.data.n_cores3);
                    setNsims(response.data.n_sim)
                    setPxHeight(response.data.pxHeight);
                    setPxWidth(response.data.pxWidth);
                    setScreenHeight(response.data.screenHeight);
                    setScreenWidth(response.data.screenWidth);
                    setRefreshRate(response.data.refreshRate);
                    setFrontCam1(response.data.frontCam1);
                    setFrontCam2(response.data.frontCam2);
                    setBackCam(response.data.backCam);
                    setSupport3G(response.data.support_3G);
                    setSupport4G(response.data.support_4G);
                    setSupport5G(response.data.support_5G);
                }

                else if (response.data.type === 2) {
                    setFunctions(response.data.functions);
                    setCompatible(response.data.compatibleDevices);
                }
                if (response.data.otherSpecification === null || response.data.otherSpecification === undefined) {
                    setOtherSpecification("");
                }
                else
                    setOtherSpecification(response.data.otherSpecification);

                setCategoryName(response.data.categoryName);
                setManufacturerName(response.data.manufacturerName);
                setBrandName(response.data.brandName);
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
            "viewCount": e.target.viewCount.value,
            "special": checkboxSpecialChecked,
            "available": checkboxAvailableChecked,
            "warranty": e.target.warranty.value,
            "type": type,
            "commonCoef": e.target.commonCoef.value,
            "gamingCoef": e.target.gamingCoef.value,
            "entertainCoef": e.target.entertainCoef.value,
            "categoryName": e.target.category.value,
            "manufacturerName": e.target.manufacturer.value,
            "brandName": e.target.brand.value
        }
        let endpoint = endpointAdmin + "/products";
        if (type !== 0) {
            productBody['model'] = e.target.model.value;
            productBody['imeiNo'] = e.target.imei.value;
            productBody['ram'] = e.target.ram.value;
            productBody['batteryPower'] = e.target.batteryPower.value;
            productBody['inMemory'] = e.target.inMemory.value;
            productBody['touchScreen'] = checkboxTouchScreenChecked;
            productBody['wifi'] = checkboxWifiChecked;
            productBody['bluetooth'] = checkboxBluetoothChecked;
            productBody['clockSpeed1'] = e.target.clockSpeed1.value;
            productBody['clockSpeed2'] = e.target.clockSpeed2.value;
            productBody['clockSpeed3'] = e.target.clockSpeed3.value;
            productBody['n_cores1'] = e.target.nCores1.value;
            productBody['n_cores2'] = e.target.nCores2.value;
            productBody['n_cores3'] = e.target.nCores3.value;
            productBody['n_sim'] = e.target.nSims.value;
            productBody['pxHeight'] = e.target.pxHeight.value;
            productBody['pxWidth'] = e.target.pxWidth.value;
            productBody['screenHeight'] = e.target.screenHeight.value;
            productBody['screenWidth'] = e.target.screenWidth.value;
            productBody['refreshRate'] = e.target.refreshRate.value;
            productBody['frontCam1'] = e.target.frontCam1.value;
            productBody['frontCam2'] = e.target.frontCam2.value;
            productBody['backCam'] = e.target.backCam.value;
            productBody['support_3G'] = support_3G;
            productBody['support_4G'] = support_4G;
            productBody['support_5G'] = support_5G;

            endpoint += "/phones/";
        }
        else {
            productBody['compatibleDevices'] = e.target.compatible.value;
            productBody['functions'] = e.target.functions.value;
            endpoint += "/accessories/";
        }
        productBody['otherSpecification'] = otherSpecification;

        console.log(JSON.stringify(productBody));

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
            toast.error(messages.updateFailed, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
            });
            console.log("error updating product: " + error);
            // console.log(error.response.data);
            // console.log(error.response.status);
            // console.log(error.response.headers);
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

    const handleWifiChange = (event) => {
        setCheckboxWifiChecked(event.target.checked);
    }

    const handleBluetoothChange = (event) => {
        setCheckboxBluetoothChecked(event.target.checked);
    }

    const handleTouchScreenChange = (event) => {
        setCheckboxTouchScreenChecked(event.target.checked);
    }

    const handleNetworkChange = (event) => {
        if (event.target.value === '5G') {
            setSupport5G(true);
            setSupport4G(true);
            setSupport3G(true);
        }
        else if (event.target.value === '4G') {
            setSupport4G(true);
            setSupport3G(true);
        }
        else
            setSupport3G(true);
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

    const handleCategoryChange = (e) => {
        if (e.target.value === "Phụ kiện")
            setType(0);
        else setType(1);
    }

    return (
        <div>
            <h2>CẬP NHẬT DỮ LIỆU SẢN PHẨM</h2>
            <Form style={{ marginTop: "2.5rem" }} onSubmit={(e) => updateProduct(e)}>
                <Row>
                    <h3 align="center">THÔNG TIN CHUNG</h3>
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
                    <FormGroup>
                        <strong><Label for="productName">Tên sản phẩm</Label></strong>
                        <Input type="text" name="productName" id="productName"
                            onChange={e => setProductName(e.target.value)}
                            placeholder="Tên sản phẩm" required value={productName} />
                        <span style={{ color: "red" }}>{errors["name"]}</span>
                    </FormGroup>
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
                            <strong><Label for="unitPrice">Đơn giá</Label></strong>
                            <Input type="number" step="0.01" name="unitPrice" required value={unitPrice}
                                id="unitPrice" placeholder="Đơn giá" min="1000" defaultValue="1000"
                                onChange={e => setUnitPrice(e.target.value)} />
                            <span style={{ color: "red" }}>{errors["price"]}</span>
                        </FormGroup>
                    </Col>
                    <Col >
                        <FormGroup>
                            <strong><Label for="discount">Giảm giá</Label></strong>
                            <Input type="number" step="0.001" name="discount" id="discount" value={discount}
                                onChange={e => setDiscount(e.target.value)}
                                placeholder="Giảm giá" min="0" max="1" defaultValue="0" />
                        </FormGroup>
                    </Col>
                    <Col >
                        <FormGroup>
                            <strong><Label for="quantity">Số lượng</Label></strong>
                            <Input type="number" name="quantity" id="quantity" placeholder="Số lượng"
                                min="1" defaultValue="1" value={quantity}
                                onChange={e => setQuantity(e.target.value)} />
                        </FormGroup>
                    </Col>
                </Row>

                <Row>
                    <Col >
                        <FormGroup>
                            <strong><Label for="commonCoef">Common Coeff</Label></strong>
                            <Input type="number" name="commonCoef" id="commonCoef" placeholder="Hệ số thông thường"
                                min="0" max="1" step="0.1" defaultValue="0" value={commonCoef}
                                onChange={e => setCommonCoef(e.target.value)} />
                        </FormGroup>
                    </Col>
                    <Col >
                        <FormGroup>
                            <strong><Label for="gamingCoef">Gaming Coeff</Label></strong>
                            <Input type="number" name="gamingCoef" id="gamingCoef" placeholder="Hệ số gaming"
                                min="0" max="1" step="0.1" defaultValue="0" value={gamingCoef}
                                onChange={e => setGamingCoef(e.target.value)} />
                        </FormGroup>
                    </Col>
                    <Col >
                        <FormGroup>
                            <strong><Label for="entertainCoef">Entertainment Coeff</Label></strong>
                            <Input type="number" name="entertainCoef" id="entertainCoef" placeholder="Hệ số thông thường"
                                min="0" max="1" step="0.1" defaultValue="0" value={entertainCoef}
                                onChange={e => setEntertainCoef(e.target.value)} />
                        </FormGroup>
                    </Col>
                </Row>

                <Row>
                    <Col sm="9">
                        <FormGroup>
                            <strong><Label for="categorySelect">Chọn loại sản phẩm</Label></strong>
                            <Input type="select" name="category" id="categorySelect" onChange={(e) => handleCategoryChange(e)}>
                                {categoryList.map((cate) => (
                                    <option key={cate.categoryId}
                                        selected={categoryName === cate.categoryName} value={cate.categoryName}
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
                <hr />
                <br /> <hr />
                <h4 align="center">THÔNG SỐ KỸ THUẬT CHI TIẾT</h4>
                <br />
                <div style={type === 0 ? { pointerEvents: "none", opacity: "0.4" } : {}}>
                    <Row>
                        <Col>
                            <strong><Label for="ram">RAM (GB)</Label></strong>
                            <Input type="number" name="ram" id="ram" placeholder="RAM (GB)"
                                min="0" defaultValue="0" value={ram}
                                onChange={e => setRam(e.target.value)} />
                        </Col>

                        <Col>
                            <strong><Label for="batteryPower">Battery power (mAh)</Label></strong>
                            <Input type="number" name="batteryPower" id="batteryPower" placeholder="batteryPower (mAh)"
                                min="0" defaultValue="0" value={batteryPower}
                                onChange={e => setBatteryPower(e.target.value)} />
                        </Col>

                        <Col>
                            <strong><Label for="in-memory">Bộ nhớ trong (GB)</Label></strong>
                            <Input type="number" name="inMemory" id="inMemory" placeholder="In-memory (GB)"
                                min="0" defaultValue="0" value={inMemory}
                                onChange={e => setInMemory(e.target.value)} />
                        </Col>

                        <Col>
                            <strong><Label for="refreshRate">Refresh Rate</Label></strong>
                            <Input type="number" name="refreshRate" id="refreshRate" placeholder="refreshRate"
                                step="0.1" min="0" defaultValue="0" value={refreshRate}
                                onChange={e => setRefreshRate(e.target.value)} />
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <strong><Label for="n-cores1">Số lượng nhân phiên bản 1</Label></strong>
                            <Input type="number" name="nCores1" id="nCores1" placeholder="n-cores1"
                                min="0" defaultValue="0" value={nCores1}
                                onChange={e => setNCores1(e.target.value)} />
                        </Col>

                        <Col>
                            <strong><Label for="clockSpeed1">Xung nhịp CPU phiên bản 1</Label></strong>
                            <Input type="number" name="clockSpeed1" id="clockSpeed1"
                                placeholder="clockSpeed1" min="0" step="0.01" defaultValue="0"
                                value={clockSpeed1} onChange={e => setClockSpeed1(e.target.value)} />
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <strong><Label for="n-cores2">Số lượng nhân phiên bản 2</Label></strong>
                            <Input type="number" name="nCores2" id="nCores2" placeholder="n-cores2"
                                min="0" defaultValue="0" value={nCores2}
                                onChange={e => setNCores2(e.target.value)} />
                        </Col>

                        <Col>
                            <strong><Label for="clockSpeed2">Xung nhịp CPU phiên bản 2</Label></strong>
                            <Input type="number" name="clockSpeed2" id="clockSpeed2"
                                placeholder="clockSpeed2" min="0" step="0.01" defaultValue="0"
                                value={clockSpeed2} onChange={e => setClockSpeed2(e.target.value)} />
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <strong><Label for="n-cores3">Số lượng nhân phiên bản 3</Label></strong>
                            <Input type="number" name="nCores3" id="nCores3" placeholder="n-cores3"
                                min="0" defaultValue="0" value={nCores3}
                                onChange={e => setNCores3(e.target.value)} />
                        </Col>

                        <Col>
                            <strong><Label for="clockSpeed3">Xung nhịp CPU phiên bản 3</Label></strong>
                            <Input type="number" name="clockSpeed3" id="clockSpeed3"
                                placeholder="clockSpeed3" min="0" step="0.01" defaultValue="0"
                                value={clockSpeed3} onChange={e => setClockSpeed3(e.target.value)} />
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <strong><Label for="pxHeight">Height Resolution</Label></strong>
                            <Input type="number" name="pxHeight" id="pxHeight" placeholder="pxHeight"
                                min="0" defaultValue="0" value={pxHeight}
                                onChange={e => setPxHeight(e.target.value)} />
                        </Col>

                        <Col>
                            <strong><Label for="pxWidth">Width Resolution</Label></strong>
                            <Input type="number" name="pxWidth" id="pxWidth" placeholder="pxWidth"
                                min="0" defaultValue="0" value={pxWidth}
                                onChange={e => setPxWidth(e.target.value)} />
                        </Col>

                        <Col>
                            <strong><Label for="screenHeight">Screen Height</Label></strong>
                            <Input type="number" name="screenHeight" id="screenHeight" placeholder="screenHeight"
                                step="0.01" min="0" defaultValue="0" value={screenHeight}
                                onChange={e => setScreenHeight(e.target.value)} />
                        </Col>

                        <Col>
                            <strong><Label for="screenWidth">Screen Width</Label></strong>
                            <Input type="number" name="screenWidth" id="screenWidth" placeholder="screenWidth"
                                step="0.01" min="0" defaultValue="0" value={screenWidth}
                                onChange={e => setScreenWidth(e.target.value)} />
                        </Col>
                    </Row>

                    <Row>
                        <Col sm="3">
                            <strong><Label for="frontCam1">Camera trước 1(MP)</Label></strong>
                            <Input type="number" name="frontCam1" id="frontCam1" placeholder="frontCam1"
                                min="0" defaultValue="0" value={frontCam1}
                                onChange={e => setFrontCam1(e.target.value)} />
                        </Col>

                        <Col sm="3">
                            <strong><Label for="frontCam2">Camera trước 2(MP)</Label></strong>
                            <Input type="number" name="frontCam2" id="frontCam2" placeholder="frontCam2"
                                min="0" defaultValue="0" value={frontCam2}
                                onChange={e => setFrontCam2(e.target.value)} />
                        </Col>

                        <Col>
                            <strong><Label for="backCam">Camera sau</Label></strong>
                            <Input type="text" name="backCam" id="backCam" placeholder="backCam"
                                value={backCam}
                                onChange={e => setBackCam(e.target.value)} />
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <strong><Label for="n-sims">Số lượng sim</Label></strong>
                            <Input type="number" name="nSims" id="nSims" placeholder="n-sims"
                                min="0" defaultValue="0" value={nSims}
                                onChange={e => setNsims(e.target.value)} />
                        </Col>

                        <Col>
                            <FormGroup>
                                <strong><Label for="networkSelect">Chọn mạng hỗ trợ</Label></strong>
                                <Input type="select" name="networks" id="networkSelect" onChange={(e) => handleNetworkChange(e)}>
                                    <option key={1} value="3G">3G</option>
                                    <option key={2} value="4G">4G</option>
                                    <option key={3} value="5G">5G</option>
                                </Input>
                            </FormGroup>
                        </Col>

                        <Col>
                            <strong><Label for="type">Type</Label></strong>
                            <Input type="number" name="type" id="type" placeholder="type"
                                min="1" defaultValue="1" value={type} max="3"
                                onChange={e => setType(e.target.value)} />
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <strong><Label for="wifi">Wifi</Label></strong>
                            <div>
                                <CustomInput type="checkbox" id="wifiCheckbox" label="wifi" name="wifiCheckbox" defaultChecked={checkboxWifiChecked}
                                    checked={checkboxWifiChecked} onChange={(e) => handleWifiChange(e)} />
                            </div>
                        </Col>

                        <Col >
                            <strong><Label for="bluetooth">Bluetooth</Label></strong>
                            <div>
                                <CustomInput type="checkbox" id="bluetoothCheckbox" label="bluetooth" name="bluetooth" defaultChecked={checkboxBluetoothChecked}
                                    checked={checkboxBluetoothChecked} onChange={(e) => handleBluetoothChange(e)} />
                            </div>
                        </Col>

                        <Col >
                            <strong><Label for="touchScreen">Touch Screen</Label></strong>
                            <div>
                                <CustomInput type="checkbox" id="touchScreenCheckbox" label="touchScreen" name="touchScreen" defaultChecked={checkboxTouchScreenChecked}
                                    checked={checkboxTouchScreenChecked} onChange={(e) => handleTouchScreenChange(e)} />
                            </div>
                        </Col>
                    </Row>
                    <hr />
                </div>

                <Row>
                    <div style={type !== 0 ? { pointerEvents: "none", opacity: "0.4" } : {}}>
                        <h4 align="center">THÔNG SỐ CỦA PHỤ KIỆN</h4>
                        <Col sm="6">
                            <FormGroup>
                                <strong><Label for="functions">Chức năng hỗ trợ</Label></strong>
                                <Input type="text" name="functions" id="functions" placeholder="functions"
                                    disabled={type !== 0} value={functions}
                                    onChange={e => setFunctions(e.target.value)} />
                                <span style={{ color: "red" }}>{errors["functions"]}</span>
                            </FormGroup>
                        </Col>
                        <Col sm="6">
                            <FormGroup>
                                <strong><Label for="compatible">Khả năng tương thích</Label></strong>
                                <Input type="text" name="compatible" id="compatible" placeholder="compatible"
                                    disabled={type !== 0} value={compatible}
                                    onChange={e => setCompatible(e.target.value)} />
                                <span style={{ color: "red" }}>{errors["compatible"]}</span>
                            </FormGroup>
                        </Col>
                    </div>
                </Row>

                <br />

                <FormGroup>
                    <strong><Label for="specification">Các thông số khác</Label></strong>
                    <CKEditor id="specification"
                        editor={ClassicEditor}
                        data={otherSpecification}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            setOtherSpecification(data);
                        }}
                    />
                </FormGroup>

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