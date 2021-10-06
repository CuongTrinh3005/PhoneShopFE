import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { endpointPublic, get } from '../HttpUtils';
import ProductList from '../ProductList';
import './feature.css'

class TopViewFilter extends Component {
    state = { productList: [] }

    componentDidMount() {
        this.fetchMostViewProducts();
    }

    fetchMostViewProducts() {
        get(endpointPublic + "/products/top-view").then((response) => {
            if (response.status === 200) {
                this.setState({ productList: response.data })
            }
        })
    }

    render() {
        return (
            <div >
                <h3 className="alert alert-info" align="center">SẢN PHẨM ĐƯỢC XEM NHIỀU NHẤT</h3>
                <ProductList productList={this.state.productList} />
            </div >
        );
    }
};

export default withRouter(TopViewFilter);