import React, { useState, useEffect } from 'react';
import { withRouter, useParams } from 'react-router-dom';
import PropagateLoader from "react-spinners/PropagateLoader";
import { endpointPublic, get } from '../HttpUtils';
import ProductList from '../ProductList';

const ProductsByOrder = () => {
    const { option } = useParams();
    const [productList, setProductList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProductsByOrder()
    }, []);

    const fetchProductsByOrder = () => {
        get(endpointPublic + "/products/option=" + option).then((response) => {
            if (response.status === 200) {
                setProductList(response.data)
                setLoading(false);
            }
        })
    }

    return (
        <div>
            {option === '1' ?
                <h3 className="alert alert-heading" align="center" style={{ marginTop: "2rem" }}>DANH MỤC SẢN PHẨM MỚI</h3> :
                <h3 className="alert alert-heading" align="center" style={{ marginTop: "2rem" }}>DANH MỤC SẢN PHẨM XEM NHIỀU</h3>}
            <ProductList productList={productList} />
            {loading &&
                <PropagateLoader
                    css={{
                        position: 'absolute', left: '50%', top: '50%',
                        transform: 'translate(-50%, -50%)'
                    }}
                    color={"#50E3C2"}
                    loading={loading}
                    size={15}
                />}
        </div>
    );
}

export default withRouter(ProductsByOrder);