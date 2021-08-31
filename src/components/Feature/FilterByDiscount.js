import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { endpointPublic, get } from '../HttpUtils';
import ProductList from '../ProductList';
import './feature.css'

class DiscountFilter extends Component {
    state = { bookList: [] }

    componentDidMount() {
        this.fetchDiscountingBooks();
    }

    fetchDiscountingBooks() {
        get(endpointPublic + "/books/discounting").then((response) => {
            if (response.status === 200) {
                this.setState({ bookList: response.data })
            }
        })
    }

    render() {
        return (
            <div >
                <h3 className="alert alert-dark" align="center">SÁCH KHUYẾN MÃI</h3>
                <ProductList bookList={this.state.bookList} />
            </div >
        );
    }
};


export default withRouter(DiscountFilter);