import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { endpointPublic, get } from '../HttpUtils';
import ProductList from '../ProductList';
import './book_in_category.css'

class BooksByCategory extends Component {
    state = { bookList: [], category: {} }

    componentDidMount() {
        this.fetchCategoryById(this.props.match.params.id);
        this.fetchBookByCategoryId(this.props.match.params.id);
    }

    fetchBookByCategoryId(id) {
        get(endpointPublic + "/books/category/" + id).then((response) => {
            if (response.status === 200) {
                this.setState({ bookList: response.data })
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
                <h3 className="alert alert-info" align="center">Sách của thể loại {this.state.category.categoryName}</h3>
                <ProductList bookList={this.state.bookList} />
            </div>
        );
    }
}

export default withRouter(BooksByCategory);