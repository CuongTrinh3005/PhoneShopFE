import React, { Component, useState, useEffect, useMemo } from 'react';
import { withRouter, useParams } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input, FormText, Col, Row, CustomInput } from 'reactstrap';
import { endpointPublic, get } from '../HttpUtils';
import ProductList from '../ProductList';
import './product_in_category.css'

const ProductsByCategory = () => {
    const { id } = useParams();
    const [productList, setProductList] = useState([]);
    const [filterList, setFilterList] = useState([]);
    const [category, setCategory] = useState({});
    const [brandList, setBrandList] = useState([]);
    const [filters, setFilters] = useState({});

    useEffect(() => {
        fetchCategoryById(id);
        fetchProductByCategoryId(id);
        fetchAllBrands();
    }, []);

    const fetchProductByCategoryId = (id) => {
        get(endpointPublic + "/products/category/" + id).then((response) => {
            if (response.status === 200) {
                setProductList(response.data);
                setFilterList(response.data);
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

    const handleFilterChange = (e, key) => {
        let selectedValue = e.target.value;
        let tempFilters = filters
        if (selectedValue !== "0") {
            tempFilters[key] = selectedValue
        }
        else {
            delete tempFilters[key]
        }
        setFilters(filters);

        if (filters === {})
            var filteredList = [...productList]
        else {
            var filteredList = productList.filter((item) => {
                if (Object.keys(filters).length > 0) {
                    for (let key in filters) {
                        if (key !== 'price' && key !== 'battery') {
                            if (item[key] === undefined || filters[key] === undefined || !filters[key].includes(item[key])) {
                                return false;
                            }
                        }
                    }
                }
                return true;
            });

            let priceOptionValue = filters['price']
            if (priceOptionValue !== null && priceOptionValue !== undefined) {
                switch (priceOptionValue) {
                    case "1": {
                        filteredList = filteredList.filter((product) => parseInt(product["unitPrice"]) < 2000000)
                        break;
                    }
                    case "2": {
                        filteredList = filteredList.filter((product) => (parseInt(product["unitPrice"]) >= 2000000 && parseInt(product["unitPrice"]) <= 4000000))
                        break;
                    }
                    case "3": {
                        filteredList = filteredList.filter((product) => (parseInt(product["unitPrice"]) >= 4000000 && parseInt(product["unitPrice"]) <= 7000000))
                        break;
                    }
                    case "4": {
                        filteredList = filteredList.filter((product) => (parseInt(product["unitPrice"]) >= 7000000 && parseInt(product["unitPrice"]) <= 13000000))
                        break;
                    }
                    case "5": {
                        filteredList = filteredList.filter((product) => (parseInt(product["unitPrice"]) >= 13000000 && parseInt(product["unitPrice"]) <= 20000000))
                        break;
                    }
                    case "6": {
                        filteredList = filteredList.filter((product) => (parseInt(product["unitPrice"]) >= 20000000))
                        break;
                    }
                    default:
                }
            }
            let batteryOptionValue = filters['battery']
            if (batteryOptionValue !== null && batteryOptionValue !== undefined) {
                switch (batteryOptionValue) {
                    case "1": {
                        filteredList = filteredList.filter((product) => parseInt(product["batteryPower"]) < 5000)
                        break;
                    }
                    case "2": {
                        filteredList = filteredList.filter((product) => (parseInt(product["batteryPower"]) >= 5000))
                        break;
                    }
                    default:
                }
            }
        }
        setFilterList(filteredList);
    }

    return (
        <div>
            <h3 className="alert alert-info" align="center">Sản phẩm của {category.categoryName}</h3>
            <p>Số lượng: {filterList.length}</p>
            <Row>
                <Col >
                    <strong><Label for="brand">Thương hiệu</Label></strong>
                    <Input type="select" name="brand" id="brandSelect"
                        onChange={e => handleFilterChange(e, 'brandName')}>
                        <option key={0} value={0} >Không</option>
                        {brandList.map((brand) => (
                            <option key={brand.brandId} value={brand.brandName}>{brand.brandName}</option>
                        ))}
                    </Input>
                </Col>
                <Col >
                    <strong><Label for="price">Giá (VNĐ)</Label></strong>
                    <Input type="select" name="price" id="priceSelect"
                        onChange={e => handleFilterChange(e, 'price')}>
                        <option key={0} value={0} >Không</option>
                        <option key={1} value={1} >Dưới 2 triệu</option>
                        <option key={2} value={2} >2 - 4 triệu</option>
                        <option key={3} value={3}>4 - 7 triệu</option>
                        <option key={4} value={4} >7 - 13 triệu </option>
                        <option key={5} value={5} >13 - 20 triệu</option>
                        <option key={6} value={6} >Trên 20 triệu</option>
                    </Input>
                </Col>
                <Col >
                    <strong><Label for="ram">RAM (GB)</Label></strong>
                    <Input type="select" name="ram" id="ramSelect"
                        onChange={e => handleFilterChange(e, 'ram')}
                        disabled={(id === 'ACCE') || (id === 'COMM')}>
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
                <Col >
                    <strong><Label for="rom">ROM (GB)</Label></strong>
                    <Input type="select" name="rom" id="romSelect"
                        onChange={e => handleFilterChange(e, 'rom')}
                        disabled={(id === 'ACCE') || (id === 'COMM')}>
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
                <Col >
                    <strong><Label for="battery">PIN (mAh)</Label></strong>
                    <Input type="select" name="battery" id="batterySelect"
                        onChange={e => handleFilterChange(e, 'battery')}
                        disabled={(id === 'ACCE') || (id === 'COMM')}>
                        <option key={0} value={0} >Không</option>
                        <option key={1} value={1} >Dưới 5000 mAh</option>
                        <option key={2} value={2} >Trên 5000 mAh</option>
                    </Input>
                </Col>
                <Col sm="3">
                    <strong><Label for="label">Hiệu năng</Label></strong>
                    <Input type="select" name="label" id="labelSelect"
                        onChange={e => handleFilterChange(e, 'label')}
                        disabled={(id === 'ACCE') || (id === 'COMM')}>
                        <option key={0} value={0} >Không</option>
                        <option key={1} value={1} >Gaming/ Cấu hình cao</option>
                        <option key={2} value={2} >Giải trí thông thường</option>
                    </Input>
                </Col>
            </Row>
            <ProductList productList={filterList} />
        </div>
    );
}

export default withRouter(ProductsByCategory);