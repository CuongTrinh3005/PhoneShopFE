import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText, Col, Row, CustomInput } from 'reactstrap';
import { endpointPublic, get, getWithAuth, post, postwithAuth, hostFrontend, endpointAdmin, hostML } from '../../components/HttpUtils';
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
    const [specification, setSpecification] = useState("");
    const [resultCateModal, setResultCateModal] = useState(false);
    const [resultBrandModal, setResultBrandModal] = useState(false);
    const [resultManufacturerModal, setResultManufacturerModal] = useState(false);
    const [warranty, setWarranty] = useState(0);
    const [label, setLabel] = useState(1);

    const [imeiNo, setImeiNo] = useState("");
    const [ram, setRam] = useState(0);
    const [rom, setRom] = useState(0);
    const [batteryPower, setBatteryPower] = useState(1000)
    const [resolution, setResolution] = useState(1);
    const [maxCore, setMaxCore] = useState(0);
    const [maxSpeed, setMaxSpeed] = useState(0);
    const [refreshRate, setRefreshRate] = useState(0);
    const [simSupport, setSimSupport] = useState(1);
    const [networks, setNetworks] = useState(1);
    const [noFrontCam, setNoFrontCam] = useState(0);
    const [touchScreen, setTouchScreen] = useState(0);
    const [wifi, setWifi] = useState(1);
    const [bluetooth, setBluetooth] = useState(1);
    const [functions, setFunctions] = useState("");
    const [compatible, setCompatible] = useState("");
    const [recommendLabel, setRecommendLabel] = useState('');

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
            "specification": specification,
            "viewCount": e.target.viewCount.value,
            "special": checkboxSpecialChecked,
            "available": checkboxAvailableChecked,
            "warranty": e.target.warranty.value,
            "label": label,
            "categoryName": e.target.category.value,
            "manufacturerName": e.target.manufacturer.value,
            "brandName": e.target.brand.value
        }
        let endpoint = endpointAdmin + "/products";
        if (label !== 0) {
            productBody['model'] = e.target.model.value;
            productBody['imeiNo'] = e.target.imei.value;
            productBody['ramScore'] = e.target.ram.value;
            productBody['romScore'] = e.target.rom.value;
            productBody['batteryPowerScore'] = parseFloat(e.target.batteryPower.value) / 1000.0;
            productBody['resolutionScore'] = e.target.resolution.value;
            productBody['maxCore'] = e.target.maxCore.value;
            productBody['maxSpeed'] = e.target.maxSpeed.value;
            productBody['refreshRateScore'] = e.target.refreshRate.value;
            productBody['simSupportScore'] = e.target.simSupport.value;
            productBody['networksScore'] = e.target.networks.value;
            productBody['noFrontCam'] = e.target.noFrontCam.value;
            productBody['touchScreen'] = checkboxTouchScreenChecked;
            productBody['wifi'] = checkboxWifiChecked;
            productBody['bluetooth'] = checkboxBluetoothChecked;

            endpoint += "/phones";
        }
        else {
            productBody['compatibleDevices'] = compatible;
            productBody['functions'] = functions;
            endpoint += "/accessories";
        }

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

    const recommendProductType = () => {
        let productBody = {
            "ram": parseFloat(ram),
            "rom": parseFloat(rom),
            "battery_power": parseFloat(batteryPower) / 1000.0,
            "resolution": parseInt(resolution),
            "max_core": parseInt(maxCore),
            "max_speed": parseFloat(maxSpeed),
            "refresh_rate": parseInt(refreshRate),
            "sim_support": parseInt(simSupport),
            "networks": parseInt(networks),
            "no_front_cam": parseInt(noFrontCam),
            "touch_screen": parseInt(touchScreen),
            "wifi": parseInt(wifi),
            "bluetooth": parseInt(bluetooth),
            "compatible_devices": compatible,
            "functions": functions
        }
        console.log("Product body in type:  ", productBody)
        post(hostML + "/recommend-products/predict-product-type", productBody).then((response) => {
            if (response.status === 200) {
                let predictedLabel = response.data.predicted_label;
                if (predictedLabel === 1)
                    setRecommendLabel("Gaming/ C???u h??nh cao");
                else if (predictedLabel === 2)
                    setRecommendLabel("Gi???i tr?? c?? b???n");
                else if (predictedLabel === 3)
                    setRecommendLabel("Nghe g???i th??ng th?????ng")

                console.log("Predict type of product!")
            }
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
        if (event.target.checked)
            setWifi(1)
        else
            setWifi(0)
    }

    const handleBluetoothChange = (event) => {
        setCheckboxBluetoothChecked(event.target.checked);
        if (event.target.checked)
            setBluetooth(1)
        else
            setBluetooth(0)
    }

    const handleTouchScreenChange = (event) => {
        setCheckboxTouchScreenChecked(event.target.checked);
        if (event.target.checked)
            setTouchScreen(1)
        else
            setTouchScreen(0)
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
        if (e.target.value === "Ph??? ki???n")
            setLabel(0);
        else setLabel(1);
    }

    const recommendClick = () => {
        recommendProductType();
    }

    return (
        <div>
            <h2>TH??M M???I D??? LI???U S???N PH???M</h2>
            <Form style={{ marginTop: "2.5rem" }} onSubmit={(e) => createNewProduct(e)}>
                <Row>
                    <Col sm="3">
                        <FormGroup>
                            <strong><Label for="model">Model</Label></strong>
                            <Input type="text" name="model" id="model" placeholder="Model"
                                required disabled={label === 0} />
                            <span style={{ color: "red" }}>{errors["model"]}</span>
                        </FormGroup>
                    </Col>

                    <Col sm="3">
                        <FormGroup>
                            <strong><Label for="imei">IMEI No</Label></strong>
                            <Input type="text" name="imei" id="imei" placeholder="imei" required
                                maxLength={15} disabled={label === 0} value={imeiNo} />
                            <span style={{ color: "red" }}>{errors["imei"]}</span>
                        </FormGroup>
                    </Col>
                </Row>

                <Row>
                    <FormGroup>
                        <strong><Label for="productName">T??n s???n ph???m</Label></strong>
                        <Input type="text" name="productName" id="productName" placeholder="T??n s???n ph???m" required />
                        <span style={{ color: "red" }}>{errors["name"]}</span>
                    </FormGroup>
                </Row>

                <Row>
                    <Col>
                        <FormGroup>
                            <strong><Label for="warranty">B???o h??nh</Label></strong>
                            <Input type="number" name="warranty" id="warranty" placeholder="B???o h??nh"
                                min="0" max="36" defaultValue="0" value={warranty}
                                onChange={e => setWarranty(e.target.value)} />
                        </FormGroup>
                    </Col>
                    <Col sm="2">
                        <FormGroup>
                            <strong><Label for="unitPrice">????n gi??</Label></strong>
                            <Input type="number" step="0.01" name="unitPrice" required
                                id="unitPrice" placeholder="????n gi??" min="1000" defaultValue="1000" />
                            <span style={{ color: "red" }}>{errors["price"]}</span>
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <strong><Label for="discount">Gi???m gi??</Label></strong>
                            <Input type="number" step="0.001" name="discount" id="discount" placeholder="Gi???m gi??" min="0" max="1" defaultValue="0" />
                        </FormGroup>
                    </Col>
                    <Col>
                        <FormGroup>
                            <strong><Label for="quantity">S??? l?????ng</Label></strong>
                            <Input type="number" name="quantity" id="quantity" placeholder="S??? l?????ng" min="1" defaultValue="1" />
                        </FormGroup>
                    </Col>
                </Row>

                <Row>
                    <Col sm="9">
                        <FormGroup>
                            <strong><Label for="categorySelect">Ch???n lo???i s???n ph???m</Label></strong>
                            <Input type="select" name="category" id="categorySelect" onChange={(e) => handleCategoryChange(e)}>
                                {categoryList.map((cate) => (
                                    <option key={cate.categoryId} value={cate.categoryName}>{cate.categoryName}</option>
                                ))}
                            </Input>
                        </FormGroup>
                    </Col>

                    <Col sm="3" style={{ marginTop: "1rem" }}>
                        <CateModal
                            buttonLabel="Th??m m???i th??? lo???i h??ng"
                            className="insert-button"
                            title="Th??m m???i th??? lo???i h??ng"
                            color="success"
                            categoryId=""
                            categoryName=""
                            description=""
                            getResultInModal={getResultInCateModal}
                            insertable={true}
                            external={true}>
                            Th??m m???i th??? lo???i h??ng</CateModal>

                    </Col>
                </Row>

                <Row>
                    <Col sm="9">
                        <FormGroup>
                            <strong><Label for="manufacturerSelect">Ch???n nh?? s???n xu???t</Label></strong>
                            <Input type="select" name="manufacturer" id="manufacturerSelect">
                                {manufacturerList.map((man) => (
                                    <option key={man.manufacturerId}>{man.manufacturerName}</option>
                                ))}
                            </Input>
                        </FormGroup>
                    </Col>

                    <Col sm="3" style={{ marginTop: "1.2rem" }}>
                        <ManufacturerModal
                            buttonLabel="Th??m m???i nh?? s???n xu???t "
                            className="insert-button"
                            title="Th??m m???i nh?? s???n xu???t"
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
                            Th??m m???i nh?? s???n xu???t</ManufacturerModal>
                    </Col>
                </Row>

                <Row>
                    <Col sm="9">
                        <FormGroup>
                            <strong><Label for="brandSelect">Ch???n th????ng hi???u</Label></strong>
                            <Input type="select" name="brand" id="brandSelect">
                                {brandList.map((brand) => (
                                    <option key={brand.brandId}>{brand.brandName}</option>
                                ))}
                            </Input>
                        </FormGroup>
                    </Col>

                    <Col sm="3" style={{ marginTop: "2rem" }}>
                        <BrandModal
                            buttonLabel="Th??m m???i th????ng hi???u"
                            className="insert-button"
                            title="Th??m m???i th????ng hi???u"
                            color="success"
                            brandId=""
                            brandName=""
                            country=""
                            description=""
                            getResultInModal={getResultInBrandModal}
                            insertable={true}
                            external={true}>
                            Th??m m???i th????ng hi???u</BrandModal>
                    </Col>
                </Row>

                <Row>
                    <Col sm="2">
                        <strong><Label for="viewCount">L?????t xem</Label></strong>
                        <Input type="number" name="viewCount" id="viewCount" placeholder="No. views" min="0" defaultValue="0" />
                    </Col>

                    <Col sm="2">
                        <strong><Label for="available">T??nh tr???ng t???t</Label></strong>
                        <div>
                            <CustomInput type="checkbox" id="availableCheckbox" label="Available" name="available" defaultChecked={checkboxAvailableChecked}
                                checked={checkboxAvailableChecked} onChange={(e) => handleAvailableChange(e)} />
                        </div>
                    </Col>

                    <Col sm="2">
                        <strong><Label for="special">H??ng ?????c bi???t</Label></strong>
                        <div>
                            <CustomInput type="checkbox" name="special" id="specialCheckbox" label="special" defaultChecked={checkboxSpecialChecked}
                                checked={checkboxSpecialChecked} onChange={(e) => handleSpecialChange(e)}
                            />
                        </div>
                    </Col>
                </Row>
                <hr />
                <br /> <hr />
                <h4 align="center">TH??NG S??? K??? THU???T ?????C TR??NG</h4>
                <br />
                <div style={label === 0 ? { pointerEvents: "none", opacity: "0.4" } : {}}>
                    <Row>
                        <Col>
                            <strong><Label for="ram">RAM (GB)</Label></strong>
                            <Input type="select" name="ram" id="ramSelect" onChange={(e) => setRam(e.target.value)}>
                                <option key={0} value={0} >Kh??ng</option>
                                <option key={1} value={1} >D?????i 2GB</option>
                                <option key={2} value={2}>2 GB</option>
                                <option key={3} value={3} >4 GB</option>
                                <option key={3.5} value={3.5} >6 GB</option>
                                <option key={4} value={4} >8 GB</option>
                                <option key={4.5} value={4.5}>12 GB</option>
                                <option key={5} value={5} >16 GB</option>
                                <option key={6} value={6} >32 GB</option>
                                <option key={7} value={7} >64 GB</option>
                                <option key={8} value={8} >128 GB</option>
                                <option key={9} value={9} >256 GB</option>
                                <option key={10} value={10} >512 GB</option>
                                <option key={11} value={11} >1 TB</option>
                            </Input>
                        </Col>

                        <Col>
                            <strong><Label for="rom">ROM (GB)</Label></strong>
                            <Input type="select" name="rom" id="romSelect" onChange={(e) => setRom(e.target.value)}>
                                <option key={0} value={0} >Kh??ng</option>
                                <option key={1} value={1} >D?????i 2GB</option>
                                <option key={2} value={2} >2 GB</option>
                                <option key={3} value={3} >4 GB</option>
                                <option key={3.5} value={3.5}>6 GB</option>
                                <option key={4} value={4} >8 GB</option>
                                <option key={4.5} value={4.5}>12 GB</option>
                                <option key={5} value={5} >16 GB</option>
                                <option key={6} value={6} >32 GB</option>
                                <option key={7} value={7} >64 GB</option>
                                <option key={8} value={8} >128 GB</option>
                                <option key={9} value={9} >256 GB</option>
                                <option key={10} value={10} >512 GB</option>
                                <option key={11} value={11} >1 TB</option>
                            </Input>
                        </Col>

                        <Col>
                            <strong><Label for="batteryPower">Battery power (mAh)</Label></strong>
                            <Input type="number" name="batteryPower" id="batteryPower" placeholder="batteryPower (mAh)"
                                min="0" defaultValue="0" onChange={(e) => setBatteryPower(e.target.value)}
                            />
                        </Col>
                        <Col>
                            <strong><Label for="resolution">Ch???t l?????ng ????? ph??n gi???i</Label></strong>
                            <Input type="select" name="resolution" id="resolutionSelect" onChange={(e) => setResolution(e.target.value)}>
                                <option key={1} value={1} >QVGA</option>
                                <option key={2} value={2} >HD</option>
                                <option key={3} value={3} >HD+</option>
                                <option key={4} value={4} >Full HD</option>
                                <option key={5} value={5} >Full HD+</option>
                                <option key={6} value={6} >QHD (2K)</option>
                                <option key={7} value={7} >QHD+ (2K+)</option>
                            </Input>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <strong><Label for="maxCore">S??? l?????ng nh??n t???i ??a</Label></strong>
                            <Input type="number" name="maxCore" id="maxCore"
                                placeholder="S??? l?????ng nh??n t???i ??a" min="0" defaultValue="0"
                                onChange={(e) => setMaxCore(e.target.value)}
                            />
                        </Col>

                        <Col>
                            <strong><Label for="maxSpeed">Xung nh???p t???i ??a</Label></strong>
                            <Input type="number" name="maxSpeed" id="maxSpeed"
                                placeholder="Xung nh???p t???i ??a" min="0" step="0.01" defaultValue="0"
                                onChange={(e) => setMaxSpeed(e.target.value)}
                            />
                        </Col>

                        <Col>
                            <strong><Label for="refreshRate">T???n s??? qu??t</Label></strong>
                            <Input type="select" name="refreshRate" id="resolutionSelect" onChange={(e) => setRefreshRate(e.target.value)}>
                                <strong><Label for="refreshRate">T???n s??? qu??t</Label></strong>
                                <option key={0} value={0}>Kh??ng</option>
                                <option key={1} value={1}>60 Hz</option>
                                <option key={2} value={2}>90 Hz</option>
                                <option key={3} value={3}>120 Hz</option>
                            </Input>
                        </Col>

                        <Col>
                            <strong><Label for="simSupport">SIM h??? tr???</Label></strong>
                            <Input type="select" name="simSupport" id="simSupport" onChange={(e) => setSimSupport(e.target.value)}>
                                <option key={1} value={1} >Mini SIM (SIM th?????ng)</option>
                                <option key={2} value={2} >Micro SIM</option>
                                <option key={3} value={3} >Nano SIM</option>
                                <option key={4} value={4} >eSIM</option>
                            </Input>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <strong><Label for="networks">M???ng h??? tr???</Label></strong>
                            <Input type="select" name="networks" id="networkSelect" onChange={(e) => setNetworks(e.target.value)}>
                                <option key={1} value={1}>2G</option>
                                <option key={2} value={2}>3G</option>
                                <option key={3} value={3}>4G</option>
                                <option key={4} value={4}>5G</option>
                            </Input>
                        </Col>

                        <Col >
                            <strong><Label for="noFrontCam">S?? l?????ng camera tr?????c (MP)</Label></strong>
                            <Input type="number" name="noFrontCam" id="noFrontCam"
                                placeholder="S?? l?????ng camera tr?????c (MP)"
                                min="0" defaultValue="0" onChange={(e) => setNoFrontCam(e.target.value)}
                            />
                        </Col>

                        <Col>
                            <strong><Label for="label">Label</Label></strong>
                            <Input type="select" name="label" id="labelSelect"
                                onChange={(e) => setLabel(e.target.value)}>
                                <strong><Label for="label">Label</Label></strong>
                                <option key={1} value={1} selected={label === 1}>Gaming/ C???u h??nh cao</option>
                                <option key={2} value={2} selected={label === 2}>Gi???i tr?? c?? b???n</option>
                                <option key={3} value={3} selected={label === 3}>Nghe g???i th??ng th?????ng</option>
                            </Input>
                        </Col>
                    </Row>

                    <Row>
                        <Col >
                            <strong><Label for="touchScreen">Touch Screen</Label></strong>
                            <div>
                                <CustomInput type="checkbox" id="touchScreenCheckbox" label="touchScreen" name="touchScreen" defaultChecked={checkboxTouchScreenChecked}
                                    checked={checkboxTouchScreenChecked} onChange={(e) => handleTouchScreenChange(e)} />
                            </div>
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
                    </Row>

                    <Row>
                        <h3 style={{ cursor: "pointer" }} onClick={recommendClick}>Recommend selecting</h3>
                        <Col>
                            <strong><Label for="suggest-label">Suggest Label</Label></strong>
                            <Input label="number" name="suggest-label" id="suggest-label"
                                placeholder="Recommend Label"
                                value={recommendLabel}
                                readOnly={true} />
                        </Col>
                    </Row>
                    <hr />
                </div>
                <Row>
                    <div style={label !== 0 ? { pointerEvents: "none", opacity: "0.4" } : {}}>
                        <h4 align="center">TH??NG S??? ?????C TR??NG C???A PH??? KI???N</h4>
                        <Col sm="6">
                            <FormGroup>
                                <strong><Label for="functions">Ch???c n??ng h??? tr???</Label></strong>
                                <Input type="text" name="functions" id="functions" placeholder="functions"
                                    disabled={label !== 0} value={functions}
                                    onChange={e => setFunctions(e.target.value)} />
                                <span style={{ color: "red" }}>{errors["functions"]}</span>
                            </FormGroup>
                        </Col>
                        <Col sm="6">
                            <FormGroup>
                                <strong><Label for="compatible">Kh??? n??ng t????ng th??ch</Label></strong>
                                <Input type="text" name="compatible" id="compatible" placeholder="compatible"
                                    disabled={label !== 0} value={compatible}
                                    onChange={e => setCompatible(e.target.value)} />
                                <span style={{ color: "red" }}>{errors["compatible"]}</span>
                            </FormGroup>
                        </Col>
                    </div>
                </Row>

                <br />

                <FormGroup>
                    <strong><Label for="specification">TH??NG S??? CHI TI???T</Label></strong>
                    <CKEditor id="specification"
                        editor={ClassicEditor}
                        data={specification}
                        onChange={(event, editor) => {
                            const data = editor.getData();
                            setSpecification(data);
                        }}
                    />
                </FormGroup>

                <FormGroup>
                    <strong><Label for="description">M?? t???</Label></strong>
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
                    <strong><Label for="photoFile">???nh</Label></strong>
                    <Input type="file" name="photo" id="photoFile" accept="image/*" onChange={(e) => onImageChange(e)} />
                    <FormText color="muted">
                        Upload ???nh
                    </FormText>
                    <img src={image} alt="No image" width="300" height="200" />
                </FormGroup>

                <Button style={{ marginTop: "2rem" }} color="primary">TH??M M???I</Button>
            </Form>
        </div>
    );
}

export default ProductGenerator;