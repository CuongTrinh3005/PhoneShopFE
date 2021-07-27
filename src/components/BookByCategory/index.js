import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ProductList from '../ProductList';
import './book_in_category.css'

class BooksByCategory extends Component {
    state = { bookList: [] }

    render() {
        return (
            <div className="book-in-category">
                <ProductList categoryName={this.props.match.params.categoryName} />
            </div>
        );
    }
}

export default withRouter(BooksByCategory);