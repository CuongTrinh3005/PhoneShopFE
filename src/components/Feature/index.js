import React, { useEffect, useState } from 'react';
import { withRouter, useHistory } from 'react-router-dom';
import { endpointPublic, get } from '../HttpUtils';
import PropagateLoader from "react-spinners/PropagateLoader";
import ProductSlider from '../ProductSlider';
import './feature.css'

const NewProductFilter = () => {
    const history = useHistory();
    const [productList, setProductList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNewProducts();
    }, []);

    const fetchNewProducts = () => {
        get(endpointPublic + "/products/top-newest").then((response) => {
            if (response.status === 200) {
                setProductList(response.data)
                setLoading(false);
            }
        })
    }

    return (
        <div className="feature-product">
            <h5 style={{ cursor: "pointer" }} onClick={() => history.push(`/products/option=1`)}>SẢN PHẨM MỚI NHẤT</h5>
            <ProductSlider productList={productList} />
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
        </div >
    );
};

export default withRouter(NewProductFilter);