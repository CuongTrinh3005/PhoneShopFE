import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { endpointPublic, get } from '../HttpUtils';
import ProductList from '../ProductList';
import './feature.css'

class NewBookFilter extends Component {
    state = { bookList: [] }

    componentDidMount() {
        this.fetchNewBooks();
    }

    fetchNewBooks() {
        get(endpointPublic + "/books/new").then((response) => {
            if (response.status === 200) {
                this.setState({ bookList: response.data })
            }
        })
    }

    render() {
        return (
            <div >
                <h3 className="alert alert-warning" align="center">SÁCH MỚI</h3>
                <ProductList bookList={this.state.bookList} />
            </div >
        );
    }
};

export default withRouter(NewBookFilter);