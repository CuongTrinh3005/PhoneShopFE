import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { endpointPublic, get } from '../HttpUtils';
import ProductList from '../ProductList';
import './feature.css'

class BestSeller extends Component {
    state = { productList: [] }

    componentDidMount() {
        this.fetchBestSellerProducts();
    }

    fetchBestSellerProducts() {
        get(endpointPublic + "/products/best-seller/limit/10").then((response) => {
            if (response.status === 200) {
                this.setState({ productList: response.data })
            }
        })
    }

    render() {
        return (
            <div >
                <h3 className="alert alert-dark" align="center">SẢN PHẨM BÁN CHẠY NHẤT</h3>
                <ProductList productList={this.state.productList} />
            </div >
        );
    }
};


export default withRouter(BestSeller);