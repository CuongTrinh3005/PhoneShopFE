import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { endpointPublic, get } from '../HttpUtils';
import ProductSlider from '../ProductSlider';
import './feature.css'

class NewProductFilter extends Component {
    state = { productList: [] }

    componentDidMount() {
        this.fetchNewProducts();
    }

    fetchNewProducts() {
        get(endpointPublic + "/products/top-newest").then((response) => {
            if (response.status === 200) {
                this.setState({ productList: response.data })
            }
        })
    }

    render() {
        return (
            <div >
                <ProductSlider title="SẢN PHẨM MỚI NHẤT" productList={this.state.productList} />
            </div >
        );
    }
};

export default withRouter(NewProductFilter);