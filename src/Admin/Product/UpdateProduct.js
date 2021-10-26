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
    const [description, setDescription] = useState("");
    const [specification, setSpecification] = useState("");
    const [categoryName, setCategoryName] = useState("");
    const [manufacturerName, setManufacturerName] = useState("");
    const [brandName, setBrandName] = useState("");
    const [resultCateModal, setResultCateModal] = useState(false);
    const [resultBrandModal, setResultBrandModal] = useState(false);
    const [resultManufacturerModal, setResultManufacturerModal] = useState(false);
    // const [productType, setProductType] = useState('1');

    const [warranty, setWarranty] = useState(0);
    const [label, setLabel] = useState(1);
    const [commonCoef, setCommonCoef] = useState(0);
    const [gamingCoef, setGamingCoef] = useState(0);
    const [entertainCoef, setEntertainCoef] = useState(0);
    const [imeiNo, setImeiNo] = useState("");
    const [model, setModel] = useState("");
    const [ram, setRam] = useState(1);
    const [rom, setRom] = useState(1);
    const [batteryPower, setBatteryPower] = useState(1000);
    const [resolution, setResolution] = useState(1);
    const [maxCore, setMaxCore] = useState(1);
    const [maxSpeed, setMaxSpeed] = useState(1);
    const [refreshRate, setRefreshRate] = useState(1);
    const [simSupport, setSimSupport] = useState(1);
    const [networks, setNetworks] = useState(1);
    const [noFrontCam, setNoFrontCam] = useState(1);
    const [touchScreen, setTouchScreen] = useState(false);
    const [wifi, setWifi] = useState(false);
    const [bluetooth, setBluetooth] = useState(false);

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
                setSpecification(response.data.specification);
                setWarranty(response.data.warranty);
                setLabel(response.data.label);
                setCommonCoef(response.data.commonCoef);
                setGamingCoef(response.data.gamingCoef);
                setEntertainCoef(response.data.entertainCoef);

                if (response.data.specification === null || response.data.specification === undefined) {
                    setSpecification("");
                }

                if (response.data.label !== 0) {
                    setModel(response.data.model);
                    setImeiNo(response.data.imeiNo);
                    setRam(response.data.ram);
                    setRom(response.data.rom);
                    setBatteryPower(response.data.batteryPower);
                    setResolution(response.data.resolution);
                    setMaxCore(response.data.maxCore);
                    setMaxSpeed(response.data.maxSpeed);
                    setRefreshRate(response.data.refreshRate);
                    setSimSupport(response.data.simSupport);
                    setNetworks(response.data.networks);
                    setNoFrontCam(response.data.noFrontCam);
                    setTouchScreen(response.data.touchScreen);
                    setWifi(response.data.wifi);
                    setBluetooth(response.data.bluetooth);
                }

                else if (response.data.label === 0) {
                    setFunctions(response.data.functions);
                    setCompatible(response.data.compatibleDevices);
                }

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
            "specification": specification,
            "viewCount": e.target.viewCount.value,
            "special": checkboxSpecialChecked,
            "available": checkboxAvailableChecked,
            "warranty": e.target.warranty.value,
            "label": label,
            "commonCoef": e.target.commonCoef.value,
            "gamingCoef": e.target.gamingCoef.value,
            "entertainCoef": e.target.entertainCoef.value,
            "categoryName": e.target.category.value,
            "manufacturerName": e.target.manufacturer.value,
            "brandName": e.target.brand.value
        }
        let endpoint = endpointAdmin + "/products";
        if (label !== 0) {
            productBody['model'] = e.target.model.value;
            productBody['imeiNo'] = e.target.imei.value;
            productBody['ram'] = e.target.ram.value;
            productBody['rom'] = e.target.rom.value;
            productBody['batteryPower'] = e.target.batteryPower.value;
            productBody['resolution'] = e.target.resolution.value;
            productBody['maxCore'] = e.target.maxCore.value;
            productBody['maxSpeed'] = e.target.maxSpeed.value;
            productBody['refreshRate'] = e.target.refreshRate.value;
            productBody['simSupport'] = e.target.simSupport.value;
            productBody['networks'] = e.target.networks.value;
            productBody['noFrontCam'] = e.target.noFrontCam.value;
            productBody['touchScreen'] = checkboxTouchScreenChecked;
            productBody['wifi'] = checkboxWifiChecked;
            productBody['bluetooth'] = checkboxBluetoothChecked;

            endpoint += "/phones/";
        }
        else {
            productBody['compatibleDevices'] = e.target.compatible.value;
            productBody['functions'] = e.target.functions.value;
            endpoint += "/accessories/";
        }

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
            setLabel(0);
        else setLabel(1);
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
                                required disabled={label !== 1} value={model}
                                onChange={e => setModel(e.target.value)} />
                            <span style={{ color: "red" }}>{errors["model"]}</span>
                        </FormGroup>
                    </Col>

                    <Col sm="3">
                        <FormGroup>
                            <strong><Label for="imei">IMEI No</Label></strong>
                            <Input type="text" name="imei" id="imei" placeholder="imei" required readOnly={true}
                                maxLength={15} disabled={label !== 1} value={imeiNo}
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
                <div style={label === 0 ? { pointerEvents: "none", opacity: "0.4" } : {}}>
                    <Row>
                        <Col>
                            <strong><Label for="ram">RAM (GB)</Label></strong>
                            <Input type="select" name="ram" id="ramSelect" onChange={(e) => setRam(e.target.value)}>
                                <option key={1} value={1} selected={ram === 1}>Dưới 2GB</option>
                                <option key={2} value={2} selected={ram === 2}>2 GB</option>
                                <option key={3} value={3} selected={ram === 3}>4 GB</option>
                                <option key={4} value={4} selected={ram === 4}>8 GB</option>
                                <option key={5} value={5} selected={ram === 5}>16 GB</option>
                                <option key={6} value={6} selected={ram === 6}>32 GB</option>
                                <option key={7} value={7} selected={ram === 7}>64 GB</option>
                                <option key={8} value={8} selected={ram === 8}>128 GB</option>
                                <option key={9} value={9} selected={ram === 9}>256 GB</option>
                                <option key={10} value={10} selected={ram === 10}>512 GB</option>
                            </Input>
                        </Col>

                        <Col>
                            <strong><Label for="rom">ROM (GB)</Label></strong>
                            <Input type="select" name="rom" id="romSelect" onChange={(e) => setRom(e.target.value)}>
                                <option key={1} value={1} selected={rom === 1}>Dưới 2GB</option>
                                <option key={2} value={2} selected={rom === 2}>2 GB</option>
                                <option key={3} value={3} selected={rom === 3}>4 GB</option>
                                <option key={4} value={4} selected={rom === 4}>8 GB</option>
                                <option key={5} value={5} selected={rom === 5}>16 GB</option>
                                <option key={6} value={6} selected={rom === 6}>32 GB</option>
                                <option key={7} value={7} selected={rom === 7}>64 GB</option>
                                <option key={8} value={8} selected={rom === 8}>128 GB</option>
                                <option key={9} value={9} selected={rom === 9}>256 GB</option>
                                <option key={10} value={10} selected={rom === 10}>512 GB</option>
                            </Input>
                        </Col>

                        <Col>
                            <strong><Label for="batteryPower">Battery power (mAh)</Label></strong>
                            <Input type="number" name="batteryPower" id="batteryPower" placeholder="batteryPower (mAh)"
                                min="0" defaultValue="0" value={batteryPower}
                                onChange={e => setBatteryPower(e.target.value)} />
                        </Col>
                        <Col>
                            <strong><Label for="resolution">Chất lượng độ phân giải</Label></strong>
                            <Input type="select" name="resolution" id="resolutionSelect" onChange={(e) => setResolution(e.target.value)}>
                                <option key={1} value={1} selected={resolution === 1}>QVGA</option>
                                <option key={2} value={2} selected={resolution === 2}>HD</option>
                                <option key={3} value={3} selected={resolution === 3}>HD+</option>
                                <option key={4} value={4} selected={resolution === 4}>Full HD</option>
                                <option key={5} value={5} selected={resolution === 5}>Full HD+</option>
                                <option key={6} value={6} selected={resolution === 6}>QHD (2K)</option>
                                <option key={7} value={7} selected={resolution === 7}>QHD+ (2K+)</option>
                            </Input>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <strong><Label for="refreshRate">Tần số quét</Label></strong>
                            <Input type="select" name="refreshRate" id="resolutionSelect" onChange={(e) => setRefreshRate(e.target.value)}>
                                <strong><Label for="refreshRate">Tần số quét</Label></strong>
                                <option key={1} value={1} selected={refreshRate === 1}>60 Hz</option>
                                <option key={2} value={2} selected={refreshRate === 2}>90 Hz</option>
                                <option key={3} value={3} selected={refreshRate === 3}>120 Hz</option>
                            </Input>
                        </Col>

                        <Col>
                            <strong><Label for="maxCore">Số lượng nhân tối đa</Label></strong>
                            <Input type="number" name="maxCore" id="maxCore"
                                placeholder="Số lượng nhân tối đa" min="0" defaultValue="0"
                                value={maxCore} onChange={e => setMaxCore(e.target.value)} />
                        </Col>

                        <Col>
                            <strong><Label for="maxSpeed">Xung nhịp tối đa</Label></strong>
                            <Input type="number" name="maxSpeed" id="maxSpeed"
                                placeholder="Xung nhịp tối đa" min="0" step="0.01" defaultValue="0"
                                value={maxSpeed} onChange={e => setMaxSpeed(e.target.value)} />
                        </Col>

                        <Col>
                            <strong><Label for="simSupport">SIM hỗ trợ</Label></strong>
                            <Input type="select" name="simSupport" id="simSupport" onChange={(e) => setSimSupport(e.target.value)}>
                                <option key={1} value={1} selected={networks === 1}>Mini SIM</option>
                                <option key={2} value={2} selected={networks === 2}>Micro SIM</option>
                                <option key={3} value={3} selected={networks === 3}>Nano SIM</option>
                                <option key={4} value={4} selected={networks === 4}>eSIM</option>
                            </Input>
                        </Col>
                    </Row>

                    <Row>
                        <Col>
                            <strong><Label for="networks">Mạng hỗ trợ</Label></strong>
                            <Input type="select" name="networks" id="networkSelect" onChange={(e) => setNetworks(e.target.value)}>
                                <option key={1} value={1} selected={networks === 1}>2G</option>
                                <option key={2} value={2} selected={networks === 2}>3G</option>
                                <option key={3} value={3} selected={networks === 3}>4G</option>
                                <option key={4} value={4} selected={networks === 4}>5G</option>
                            </Input>
                        </Col>

                        <Col >
                            <strong><Label for="noFrontCam">Sô lượng camera trước (MP)</Label></strong>
                            <Input type="number" name="noFrontCam" id="noFrontCam"
                                placeholder="Sô lượng camera trước (MP)"
                                min="0" defaultValue="0" value={noFrontCam}
                                onChange={e => setNoFrontCam(e.target.value)} />
                        </Col>

                        <Col>
                            <strong><Label for="label">Label</Label></strong>
                            <Input label="number" name="label" id="label" placeholder="label"
                                min="1" defaultValue="1" value={label} max="3"
                                onChange={e => setLabel(e.target.value)} />
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
                    <div style={label !== 0 ? { pointerEvents: "none", opacity: "0.4" } : {}}>
                        <h4 align="center">THÔNG SỐ CỦA PHỤ KIỆN</h4>
                        <Col sm="6">
                            <FormGroup>
                                <strong><Label for="functions">Chức năng hỗ trợ</Label></strong>
                                <Input type="text" name="functions" id="functions" placeholder="functions"
                                    disabled={label !== 0} value={functions}
                                    onChange={e => setFunctions(e.target.value)} />
                                <span style={{ color: "red" }}>{errors["functions"]}</span>
                            </FormGroup>
                        </Col>
                        <Col sm="6">
                            <FormGroup>
                                <strong><Label for="compatible">Khả năng tương thích</Label></strong>
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
                    <strong><Label for="specification">Các thông số khác</Label></strong>
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