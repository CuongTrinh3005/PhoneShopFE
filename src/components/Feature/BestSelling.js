import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { endpointPublic, get } from '../HttpUtils';
import ProductList from '../ProductList';
import './feature.css'

class BestSelling extends Component {
    state = { bookList: [] }

    componentDidMount() {
        this.fetchDiscountingBooks();
    }

    fetchDiscountingBooks() {
        get(endpointPublic + "/books/best-selling").then((response) => {
            if (response.status === 200) {
                this.setState({ bookList: response.data })
            }
        })
    }

    render() {
        return (
            <div >
                <h3 className="alert alert-dark" align="center">SÁCH BÁN CHẠY NHẤT</h3>
                <ProductList bookList={this.state.bookList} />
            </div >
        );
    }
};


export default withRouter(BestSelling);