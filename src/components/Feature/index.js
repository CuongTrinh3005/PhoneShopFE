import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { endpointPublic, get } from '../HttpUtils';
import ProductList from '../ProductList';
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
                <h3 className="alert alert-warning" align="center">HÀNG MỚI</h3>
                <ProductList productList={this.state.productList} />
            </div >
        );
    }
};

export default withRouter(NewProductFilter);