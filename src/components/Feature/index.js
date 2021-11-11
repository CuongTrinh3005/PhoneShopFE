import React, { useEffect, useState } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { endpointPublic, get } from '../HttpUtils';
import ProductSlider from '../ProductSlider';
import './feature.css'

const NewProductFilter = () => {
    const history = useHistory();
    const [productList, setProductList] = useState([]);

    useEffect(() => {
        fetchNewProducts();
    }, []);

    const fetchNewProducts = () => {
        get(endpointPublic + "/products/top-newest").then((response) => {
            if (response.status === 200) {
                setProductList(response.data)
            }
        })
    }

    return (
        <div >
            <h5 style={{ cursor: "pointer" }} onClick={() => history.push(`/products/option=1`)}>SẢN PHẨM MỚI NHẤT</h5>
            <ProductSlider productList={productList} />
        </div >
    );
};

export default withRouter(NewProductFilter);