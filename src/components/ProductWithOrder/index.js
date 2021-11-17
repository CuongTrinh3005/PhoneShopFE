import React, { useState, useEffect } from 'react';
import { withRouter, useParams } from 'react-router-dom';
import { endpointPublic, get } from '../HttpUtils';
import ProductList from '../ProductList';

const ProductsByOrder = () => {
    const { option } = useParams();
    const [productList, setProductList] = useState([]);

    useEffect(() => {
        fetchProductsByOrder()
    }, []);

    const fetchProductsByOrder = () => {
        get(endpointPublic + "/products/option=" + option).then((response) => {
            if (response.status === 200) {
                setProductList(response.data)
            }
        })
    }

    return (
        <div>
            {option === '1' ?
                <h3 className="alert alert-heading" align="center" style={{ marginTop: "2rem" }}>DANH MỤC SẢN PHẨM MỚI</h3> :
                <h3 className="alert alert-heading" align="center" style={{ marginTop: "2rem" }}>DANH MỤC SẢN PHẨM XEM NHIỀU</h3>}
            <ProductList productList={productList} />
        </div>
    );
}

export default withRouter(ProductsByOrder);