import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { endpointPublic, get } from '../HttpUtils';
import PropagateLoader from "react-spinners/PropagateLoader";
import ProductSlider from '../ProductSlider';
import './feature.css'

class DiscountFilter extends Component {
    state = { productList: [], loading: true }

    componentDidMount() {
        this.fetchDiscountingProducts();
    }

    fetchDiscountingProducts() {
        get(endpointPublic + "/products/top-discount").then((response) => {
            if (response.status === 200) {
                this.setState({ productList: response.data })
                this.setState({ loading: false });
            }
        })
    }

    render() {
        return (
            <div className="feature-product">
                <ProductSlider title="KHUYẾN MÃI" productList={this.state.productList} />
                {this.state.loading &&
                    <PropagateLoader
                        css={{
                            position: 'absolute', left: '50%', top: '50%',
                            transform: 'translate(-50%, -50%)'
                        }}
                        color={"#50E3C2"}
                        loading={this.state.loading}
                        size={15}
                    />}
            </div >
        );
    }
};


export default withRouter(DiscountFilter);