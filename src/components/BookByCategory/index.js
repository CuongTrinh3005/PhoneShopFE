import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import CartItem from '../CardItem';
import './book_in_category.css'

class BooksByCategory extends Component {
    state = { bookList: [] }

    render() {
        return (
            <div className="book-in-category">
                <CartItem categoryName={this.props.match.params.categoryName} />
            </div>
        );
    }
}

export default withRouter(BooksByCategory);