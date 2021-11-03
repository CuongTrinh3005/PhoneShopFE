import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { endpointPublic, get } from '../HttpUtils';
import ProductSlider from '../ProductSlider';
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
                <ProductSlider title="XEM NHIỀU NHẤT" productList={this.state.productList} />
            </div >
        );
    }
};

export default withRouter(TopViewFilter);