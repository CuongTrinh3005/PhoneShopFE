import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { endpointPublic, get } from '../HttpUtils';
import ProductList from '../ProductList';
import './product_in_category.css'

class ProductsByCategory extends Component {
    state = { productList: [], category: {} }

    componentDidMount() {
        this.fetchCategoryById(this.props.match.params.id);
        this.fetchProductByCategoryId(this.props.match.params.id);
    }

    fetchProductByCategoryId(id) {
        get(endpointPublic + "/products/category/" + id).then((response) => {
            if (response.status === 200) {
                this.setState({ productList: response.data })
            }
        })
    }

    fetchCategoryById(id) {
        get(endpointPublic + "/categories/" + id).then((response) => {
            if (response.status === 200) {
                this.setState({ category: response.data })
            }
        })
    }

    render() {
        return (
            <div>
                <h3 className="alert alert-info" align="center">Sản phẩm của {this.state.category.categoryName}</h3>
                <ProductList productList={this.state.productList} />
            </div>
        );
    }
}

export default withRouter(ProductsByCategory);