import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { endpointPublic, get } from '../HttpUtils';

class Detail extends Component {
    state = { book: {} }

    componentDidMount() {
        this.fetchBookById();
    }

    fetchBookById() {
        get(endpointPublic + "/books/" + this.props.match.params.id).then((response) => {
            if (response.status === 200) {
                this.setState({ book: response.data })
                console.log("Books id: ", response.data)
            }
        })
    }

    formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 2
    })

    render() {
        return (
            <div>
                <h1>Book details {this.props.match.params.id}</h1>
                <p>Name: {this.state.book.bookName}</p>
                <p>Category: {this.state.book.categoryName}</p>
                <p>Price: {this.formatter.format(this.state.book.unitPrice)} </p>
                <p>Publisher Name: {this.state.book.publisherName}</p>
            </div>


        );
    }
}

export default withRouter(Detail);