import React, { Component, useState, useEffect } from 'react';
import { withRouter, useParams } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input, FormText, Col, Row, CustomInput } from 'reactstrap';
import { endpointPublic, get } from '../HttpUtils';
import ProductList from '../ProductList';
import './product_in_category.css'

const ProductsByCategory = () => {
    const { id } = useParams();
    const [productList, setProductList] = useState([]);
    // const [currentList, setCurrentList] = useState([]);
    const [category, setCategory] = useState({});
    const [brandList, setBrandList] = useState([]);
    const [selectedBrandName, setSelectedBrandName] = useState("");
    const [selectedPrice, setSelectedPrice] = useState("");
    const [selectedRam, setSelectedRam] = useState("");
    const [selectedRom, setSelectedRom] = useState("");
    const [selectedBattery, setSelectedBattery] = useState("");

    useEffect(() => {
        fetchCategoryById(id);
        fetchProductByCategoryId(id);
        fetchAllBrands();
    }, []);

    const fetchProductByCategoryId = (id) => {
        get(endpointPublic + "/products/category/" + id).then((response) => {
            if (response.status === 200) {
                setProductList(response.data);
            }
        })
    }

    const fetchCategoryById = (id) => {
        get(endpointPublic + "/categories/" + id).then((response) => {
            if (response.status === 200) {
                setCategory(response.data);
            }
        })
    }

    const fetchAllBrands = () => {
        get(endpointPublic + "/brands/").then((response) => {
            if (response.status === 200) {
                setBrandList(response.data);
            }
        })
    }

    const handleBrandNameChange = (e) => {
        let selectedValue = e.target.value;
        console.log("Selected value: ", selectedValue)
        if (selectedValue === 0)
            selectedBrandName('');
        else
            setSelectedBrandName(e.target.value.toLowerCase());
    }

    const handlePriceChange = (e) => {
        let selectedValue = e.target.value;
        console.log("Selected value: ", selectedValue)
        if (selectedValue === 0)
            setSelectedPrice('');
        else
            setSelectedPrice(e.target.value);
    }

    const handleRamChange = (e) => {
        let selectedValue = e.target.value;
        console.log("Selected value: ", selectedValue)
        if (selectedValue === 0)
            setSelectedRam('');
        else
            setSelectedRam(e.target.value);
    }

    const handleRomChange = (e) => {
        let selectedValue = e.target.value;
        console.log("Selected value: ", selectedValue)
        if (selectedValue === 0)
            setSelectedRom('');
        else
            setSelectedRom(e.target.value.toString());
    }

    const handleBatteryChange = (e) => {
        let selectedValue = e.target.value;
        console.log("Selected value: ", selectedValue)
        if (selectedValue === 0)
            setSelectedBattery('');
        else
            setSelectedBattery(e.target.value);
    }

    var currentList = [], stageOne = [], stageTwo = [], stageThree = [], stateFour = [];
    if (selectedBrandName === '')
        currentList = [...productList];
    else {
        stageOne = productList.filter((product) => product['brandName'].toLowerCase().includes(selectedBrandName)
            // || product['ram'].toString().includes(selectedRam) 
            // || product['rom'].toString().includes(selectedRom)
            // || product['batteryPower'].toString().includes(selectedBattery)
        );
        currentList = [...stageOne]
    }
    // stageTwo = [...stageOne]
    // if (selectedRam !== '') {
    //     // console.log("Product Ram: ", product['ram']);
    //     console.log("Selected Ram: ", selectedRam.constructor.name);
    //     stageTwo = stageOne.filter((product) => {
    //         console.log("Product Ram: ", product['ram']);
    //         product['ram'].toString().includes(selectedRam.toString())
    //     });
    //     currentList = [...stageTwo]
    // }

    return (
        <div>
            <h3 className="alert alert-info" align="center">Sản phẩm của {category.categoryName}</h3>
            <p>Số lượng: {currentList.length}</p>
            <Row>
                <Col>
                    <strong><Label for="brand">Thương hiệu</Label></strong>
                    <Input type="select" name="brand" id="brandSelect"
                        onChange={e => handleBrandNameChange(e)}>
                        <option key={0} value={0} >Không</option>
                        {brandList.map((brand) => (
                            <option key={brand.brandId} value={brand.brandName}>{brand.brandName}</option>
                        ))}
                    </Input>
                </Col>
                <Col>
                    <strong><Label for="price">Giá (VNĐ)</Label></strong>
                    <Input type="select" name="price" id="priceSelect"
                        onChange={e => handlePriceChange(e)}>
                        <option key={0} value={0} >Không</option>
                        <option key={1} value={1} >Dưới 2 triệu</option>
                        <option key={2} value={2} >2 - 4 triệu</option>
                        <option key={3} value={3}>4 - 7 triệu</option>
                        <option key={4} value={4} >7 - 13 triệu </option>
                        <option key={5} value={5} >13 - 20 triệu</option>
                        <option key={6} value={6} >Trên 20 triệu</option>
                    </Input>
                </Col>
                <Col>
                    <strong><Label for="ram">RAM (GB)</Label></strong>
                    <Input type="select" name="ram" id="ramSelect"
                        onChange={e => handleRamChange(e)}>
                        <option key={0} value={0} >Không</option>
                        <option key={1} value={1} >Dưới 2GB</option>
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
                    <Input type="select" name="rom" id="romSelect"
                        onChange={e => handleRomChange(e)}>
                        <option key={0} value={0} >Không</option>
                        <option key={1} value={1} >Dưới 2GB</option>
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
                    <strong><Label for="battery">PIN (mAh)</Label></strong>
                    <Input type="select" name="battery" id="batterySelect"
                        onChange={e => handleBatteryChange(e)}>
                        <option key={0} value={0} >Không</option>
                        <option key={1} value={1} >Dưới 5000 mAh</option>
                        <option key={2} value={2} >Trên 5000 mAh</option>
                    </Input>
                </Col>
            </Row>
            <ProductList productList={currentList} />
        </div>
    );
}

export default withRouter(ProductsByCategory);