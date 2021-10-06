import React, { useState, useEffect } from 'react';
import { endpointPublic, get } from './HttpUtils';
import ProductList from './ProductList';
import './ProductList/item.css'

const Home = () => {
    const [productList, setProductList] = useState([]);

    useEffect(() => {
        fetchAllPublicProducts();
    }, []);

    const fetchAllPublicProducts = () => {
        get(endpointPublic + "/products").then((response) => {
            if (response.status === 200) {
                setProductList(response.data);
                console.log("Products: ", response.data)
            }
        })
    }

    return (
        <div>
            <h1 className="alert alert-info" align="center"
                style={{ marginTop: "2rem" }}>CSHOP XIN CHÀO</h1>
            <br />
            <ProductList title="DANH MỤC SẢN PHẨM" productList={productList} />
        </div>
    );
}

export default Home;