import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { endpointPublic, get } from '../HttpUtils';
import ProductList from '../ProductList';

class BookSearching extends Component {
    state = { bookList: [] }

    componentWillMount() {
        console.log('searching info: ' + this.props.match.params.info)
        this.fetchBookSearching(this.props.match.params.info)
    }

    fetchBookSearching(name) {
        get(endpointPublic + "/books/search/?name=" + name.trim()).then((response) => {
            if (response.status === 200) {
                this.setState({ bookList: response.data });
                console.log("Books: ", response.data)
            }
        }).catch(error => console.log('Error: ' + error));
    }

    render() {
        return (
            <div>
                <h3 className="alert alert-info row" align="center">Tìm kiếm được {this.state.bookList.length} kết quả</h3>
                <ProductList bookList={this.state.bookList} />
            </div>
        );
    }
}

export default withRouter(BookSearching);