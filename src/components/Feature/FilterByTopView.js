import React, { useEffect, useState } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { endpointPublic, get } from '../HttpUtils';
import ProductSlider from '../ProductSlider';
import './feature.css'

const TopViewFilter = () => {
    const history = useHistory();
    const [productList, setProductList] = useState([]);

    useEffect(() => {
        fetchNewProducts();
    }, []);

    const fetchNewProducts = () => {
        get(endpointPublic + "/products/top-view").then((response) => {
            if (response.status === 200) {
                setProductList(response.data)
            }
        })
    }

    return (
        <div >
            <h5 style={{ cursor: "pointer" }} onClick={() => history.push(`/products/option=2`)}>SẢN PHẨM XEM NHIỀU</h5>
            <ProductSlider productList={productList} />
        </div >
    );
};

export default withRouter(TopViewFilter);