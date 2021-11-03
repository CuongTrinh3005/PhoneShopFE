import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { endpointPublic, get } from '../HttpUtils';
import ProductList from '../ProductList';
import ProductSlider from '../ProductSlider';
import './feature.css'

class DiscountFilter extends Component {
    state = { productList: [] }

    componentDidMount() {
        this.fetchDiscountingProducts();
    }

    fetchDiscountingProducts() {
        get(endpointPublic + "/products/top-discount").then((response) => {
            if (response.status === 200) {
                this.setState({ productList: response.data })
            }
        })
    }

    render() {
        return (
            <div >
                <ProductSlider title="KHUYẾN MÃI" productList={this.state.productList} />
            </div >
        );
    }
};


export default withRouter(DiscountFilter);