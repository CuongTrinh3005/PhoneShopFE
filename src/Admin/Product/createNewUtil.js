import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText, Col, Row, CustomInput } from 'reactstrap';
import { endpointPublic, get, getWithAuth, endpointUser, postwithAuth, hostFrontend, endpointAdmin } from '../../components/HttpUtils';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { messages } from '../../components/message';
import CateModal from '../Category/CateModal';
import BrandModal from '../Brand/BrandModal';
import ManufacturerModal from '../Manufacturer/ManufacturerModal';

toast.configure();
const ProductGenerator = () => {
    const [brandList, setBrandList] = useState([]);
    const [manufacturerList, setManufacturerList] = useState([]);
    const [categoryList, setCategoryList] = useState([]);
    const [image, setImage] = useState(null);
    const [checkboxAvailableChecked, setCheckboxAvailableChecked] = useState(true);
    const [checkboxSpecialChecked, setCheckboxSpecialChecked] = useState(false);
    const [checkboxWifiChecked, setCheckboxWifiChecked] = useState(true);
    const [checkboxBluetoothChecked, setCheckboxBluetoothChecked] = useState(true);
    const [checkboxTouchScreenChecked, setCheckboxTouchScreenChecked] = useState(true);
    const [base64Str, setBase64Str] = useState("");
    const [errors, setErrors] = useState({});
    const [description, setDescription] = useState("")
    const [resultCateModal, setResultCateModal] = useState(false);
    const [resultBrandModal, setResultBrandModal] = useState(false);
    const [resultManufacturerModal, setResultManufacturerModal] = useState(false);
    const [productType, setProductType] = useState('1');
    const [warranty, setWarranty] = useState(0);
    const [label, setLabel] = useState(1);

    const [imeiNo, setImeiNo] = useState("");
    const [commonCoef, setCommonCoef] = useState(0);
    const [gamingCoef, setGamingCoef] = useState(0);
    const [entertainCoef, setEntertainCoef] = useState(0);
    const [ram, setRam] = useState(2);
    const [batteryPower, setBatteryPower] = useState(1000);
    const [inMemory, setInMemory] = useState(32);
    const [clockSpeed, setClockSpeed] = useState(1.3);
    const [nCores, setNCores] = useState(2);
    const [nSims, setNsims] = useState(1);
    const [pxHeight, setPxHeight] = useState(0);
    const [pxWidth, setPxWidth] = useState(0);
    const [screenHeight, setScreenHeight] = useState(0);
    const [screenWidth, setScreenWidth] = useState(0);
    const [refreshRate, setRefreshRate] = useState(120);
    const [frontCam, setFrontCam] = useState(4);
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

    const getIMEINo = () => {
        get(endpointPublic + "/imei").then((response) => {
            if (response.status === 200) {
                setImeiNo(response.data);
            }
        })
    }

    useEffect(() => {
        fetchAllManufacturers();
        fetchAllBrands();
        fetchCategories();
        getIMEINo();

        if (resultCateModal === true)
            fetchCategories();

        if (resultBrandModal === true)
            fetchAllBrands()

        if (resultManufacturerModal === true)
            fetchAllManufacturers()
    }, [resultCateModal, resultBrandModal, resultManufacturerModal]);

    const createNewProduct = (e) => {
        e.preventDefault();
        if (!validateForm(e.target.productName.value.trim(), e.target.unitPrice.value))
            return;

        let productBody = {
            "productName": e.target.productName.value.trim(),
            "unitPrice": e.target.unitPrice.value,
            "quantity": e.target.quantity.value,
            "discount": e.target.discount.value,
            "image": getByteaFromBase64Str(base64Str),
            "description": description,
            "viewCount": e.target.viewCount.value,
            "special": checkboxSpecialChecked,
            "available": checkboxAvailableChecked,
            "warranty": e.target.warranty.value,
            "label": e.target.label.value,
            "commonCoef": e.target.commonCoef.value,
            "gamingCoef": e.target.gamingCoef.value,
            "entertainCoef": e.target.entertainCoef.value,
            "categoryName": e.target.category.value,
            "manufacturerName": e.target.manufacturer.value,
            "brandName": e.target.brand.value
        }
        let endpoint = endpointAdmin + "/products";
        if (productType === '1') {
            productBody['model'] = e.target.model.value;
            productBody['imeiNo'] = e.target.imei.value;
            productBody['ram'] = e.target.ram.value;
            productBody['batteryPower'] = e.target.batteryPower.value;
            productBody['inMemory'] = e.target.inMemory.value;
            productBody['touchScreen'] = checkboxTouchScreenChecked;
            productBody['wifi'] = checkboxWifiChecked;
            productBody['bluetooth'] = checkboxBluetoothChecked;
            productBody['clockSpeed'] = e.target.clockSpeed.value;
            productBody['n_cores'] = e.target.nCores.value;
            productBody['n_sim'] = e.target.nSims.value;
            productBody['pxHeight'] = e.target.pxHeight.value;
            productBody['pxWidth'] = e.target.pxWidth.value;
            productBody['screenHeight'] = e.target.screenHeight.value;
            productBody['screenWidth'] = e.target.screenWidth.value;
            productBody['refreshRate'] = e.target.refreshRate.value;
            productBody['frontCam'] = e.target.frontCam.value;
            productBody['support_3G'] = support_3G;
            productBody['support_4G'] = support_4G;
            productBody['support_5G'] = support_5G;

            endpoint += "/phones";
        }
        else if (productType === '2') {
            productBody['compatibleDevices'] = compatible;
            productBody['functions'] = functions;
            endpoint += "/accessories";
        }
        productBody['otherSpecification'] = otherSpecification;

        console.log(JSON.stringify(productBody));

        postwithAuth(endpoint, productBody).then((response) => {
            if (response.status === 200 || response.status === 201) {
                console.log(messages.insertSuccess);
                toast.success(messages.insertSuccess, {
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
            console.log("error inserting new product: " + error);
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
            setProductType('2');
        else setProductType('1');
    }

    return (
        <div>
            <h2>THÊM MỚI DỮ LIỆU SẢN PHẨM</h2>
            <Form style={{ marginTop: "2.5rem" }} onSubmit={(e) => createNewProduct(e)}>
                <Row>
                    <Col sm="6">
                        <FormGroup>
                            <strong>
                                <Label for="typeSelect">Chọn loại sản phẩm để tạo</Label>
                            </strong>
                            <Input type="select" name="type" id="typeSelect"
                                onChange={e => setProductType(e.target.value)}
                                style={{ width: "8rem" }}>
                                <option key={1} value={1} >Phone</option>
                                <option key={2} value={2} >Accessory</option>
                            </Input>
                        </FormGroup>
                    </Col>

                    <Col sm="3">
                        <FormGroup>
                            <strong><Label for="model">Model</Label></strong>
                            <Input type="text" name="model" id="model" placeholder="Model"
                                required disabled={productType !== "1"} />
                            <span style={{ color: "red" }}>{errors["model"]}</span>
                        </FormGroup>
                    </Col>

                    <Col sm="3">
                        <FormGroup>
                            <strong><Label for="imei">IMEI No</Label></strong>
                            <Input type="text" name="imei" id="imei" placeholder="imei" required
                                maxLength={15} disabled={productType !== "1"} value={imeiNo} />
                            <span style={{ color: "red" }}>{errors["imei"]}</span>
                        </FormGroup>
                    </Col>
                </Row>
                <Row>
                    <Col sm="6">
                        <FormGroup>
                            <strong><Label for="productName">Tên sản phẩm</Label></strong>
                            <Input type="text" name="productName" id="productName" placeholder="Tên sản phẩm" required />
                            <span style={{ color: "red" }}>{errors["name"]}</span>
                        </FormGroup>
                    </Col>

                    <Col sm="2">
                        <FormGroup>
                            <strong><Label for="unitPrice">Đơn giá</Label></strong>
                            <Input type="number" step="0.01" name="unitPrice" required
                                id="unitPrice" placeholder="Đơn giá" min="1000" defaultValue="1000" />
                            <span style={{ color: "red" }}>{errors["price"]}</span>
                        </FormGroup>
                    </Col>
                    <Col sm="2">
                        <FormGroup>
                            <strong><Label for="discount">Giảm giá</Label></strong>
                            <Input type="number" step="0.001" name="discount" id="discount" placeholder="Giảm giá" min="0" max="1" defaultValue="0" />
                        </FormGroup>
                    </Col>
                    <Col sm="2">
                        <FormGroup>
                            <strong><Label for="quantity">Số lượng</Label></strong>
                            <Input type="number" name="quantity" id="quantity" placeholder="Số lượng" min="1" defaultValue="1" />
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
                                    <option key={cate.categoryId} value={cate.categoryName}>{cate.categoryName}</option>
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
                                    <option key={man.manufacturerId}>{man.manufacturerName}</option>
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
                                    <option key={brand.brandId}>{brand.brandName}</option>
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
                        <Input type="number" name="viewCount" id="viewCount" placeholder="No. views" min="0" defaultValue="0" />
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
                <div style={productType !== '1' ? { pointerEvents: "none", opacity: "0.4" } : {}}>
                    <Row>
                        <Col>
                            <strong><Label for="ram">RAM (GB)</Label></strong>
                            <Input type="number" name="ram" id="ram" placeholder="RAM (GB)"
                                min="0" defaultValue="0" value={ram} required={productType === '1'}
                                onChange={e => setRam(e.target.value)} />
                        </Col>

                        <Col>
                            <strong><Label for="batteryPower">Battery power (mAh)</Label></strong>
                            <Input type="number" name="batteryPower" id="batteryPower" placeholder="batteryPower (mAh)"
                                min="0" defaultValue="0" value={batteryPower} required={productType === '1'}
                                onChange={e => setBatteryPower(e.target.value)} />
                        </Col>

                        <Col>
                            <strong><Label for="in-memory">Bộ nhớ trong (GB)</Label></strong>
                            <Input type="number" name="inMemory" id="inMemory" placeholder="In-memory (GB)"
                                min="0" defaultValue="0" value={inMemory} required={productType === '1'}
                                onChange={e => setInMemory(e.target.value)} />
                        </Col>

                        <Col>
                            <strong><Label for="clockSpeed">Xung nhịp</Label></strong>
                            <Input type="number" name="clockSpeed" id="clockSpeed" placeholder="clockSpeed"
                                min="0" step="0.01" defaultValue="0" value={clockSpeed} required={productType === '1'}
                                onChange={e => setClockSpeed(e.target.value)} />
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <strong><Label for="n-cores">Số lượng nhân</Label></strong>
                            <Input type="number" name="nCores" id="nCores" placeholder="n-cores"
                                min="0" defaultValue="0" value={nCores} required={productType === '1'}
                                onChange={e => setNCores(e.target.value)} />
                        </Col>

                        <Col>
                            <strong><Label for="n-sims">Số lượng sim</Label></strong>
                            <Input type="number" name="nSims" id="nSims" placeholder="n-sims"
                                min="0" defaultValue="0" value={nSims} required={productType === '1'}
                                onChange={e => setNsims(e.target.value)} />
                        </Col>

                        <Col>
                            <strong><Label for="frontCam">Camera trước (MP)</Label></strong>
                            <Input type="number" name="frontCam" id="frontCam" placeholder="frontCam"
                                min="0" defaultValue="0" value={frontCam} required={productType === '1'}
                                onChange={e => setFrontCam(e.target.value)} />
                        </Col>

                        <Col>
                            <FormGroup>
                                <strong><Label for="networkSelect">Chọn mạng hỗ trợ</Label></strong>
                                <Input type="select" name="networks" id="networkSelect" required={productType === '1'} onChange={(e) => handleNetworkChange(e)}>
                                    <option key={1} value="3G">3G</option>
                                    <option key={2} value="4G">4G</option>
                                    <option key={3} value="5G">5G</option>
                                </Input>
                            </FormGroup>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <strong><Label for="pxHeight">Height Resolution</Label></strong>
                            <Input type="number" name="pxHeight" id="pxHeight" placeholder="pxHeight"
                                min="0" defaultValue="0" value={pxHeight} required={productType === '1'}
                                onChange={e => setPxHeight(e.target.value)} />
                        </Col>

                        <Col>
                            <strong><Label for="pxWidth">Width Resolution</Label></strong>
                            <Input type="number" name="pxWidth" id="pxWidth" placeholder="pxWidth"
                                min="0" defaultValue="0" value={pxWidth} required={productType === '1'}
                                onChange={e => setPxWidth(e.target.value)} />
                        </Col>

                        <Col>
                            <strong><Label for="screenHeight">Screen Height</Label></strong>
                            <Input type="number" name="screenHeight" id="screenHeight" placeholder="screenHeight"
                                step="0.1" min="0" defaultValue="0" value={screenHeight} required={productType === '1'}
                                onChange={e => setScreenHeight(e.target.value)} />
                        </Col>

                        <Col>
                            <strong><Label for="screenWidth">Screen Width</Label></strong>
                            <Input type="number" name="screenWidth" id="screenWidth" placeholder="screenWidth"
                                step="0.1" min="0" defaultValue="0" value={screenWidth} required={productType === '1'}
                                onChange={e => setScreenWidth(e.target.value)} />
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <strong><Label for="refreshRate">Refresh Rate</Label></strong>
                            <Input type="number" name="refreshRate" id="refreshRate" placeholder="refreshRate"
                                step="0.1" min="0" defaultValue="0" value={refreshRate}
                                onChange={e => setRefreshRate(e.target.value)} />
                        </Col>

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
                    <div style={productType !== '2' ? { pointerEvents: "none", opacity: "0.4" } : {}}>
                        <h4 align="center">THÔNG SỐ CỦA PHỤ KIỆN</h4>
                        <Col sm="6">
                            <FormGroup>
                                <strong><Label for="functions">Chức năng hỗ trợ</Label></strong>
                                <Input type="text" name="functions" id="functions" placeholder="functions"
                                    required disabled={productType !== '2'} value={functions}
                                    onChange={e => setFunctions(e.target.value)} />
                                <span style={{ color: "red" }}>{errors["functions"]}</span>
                            </FormGroup>
                        </Col>
                        <Col sm="6">
                            <FormGroup>
                                <strong><Label for="compatible">Khả năng tương thích</Label></strong>
                                <Input type="text" name="compatible" id="compatible" placeholder="compatible"
                                    required disabled={productType !== '2'} value={compatible}
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

                <br />
                <FormGroup>
                    <strong><Label for="photoFile">Ảnh</Label></strong>
                    <Input type="file" name="photo" id="photoFile" accept="image/*" onChange={(e) => onImageChange(e)} />
                    <FormText color="muted">
                        Upload ảnh
                    </FormText>
                    <img src={image} alt="No image" width="300" height="200" />
                </FormGroup>

                <Button style={{ marginTop: "2rem" }} color="primary">THÊM MỚI</Button>
            </Form>
        </div>
    );
}

export default ProductGenerator;