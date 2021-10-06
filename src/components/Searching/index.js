import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { endpointPublic, get } from '../HttpUtils';
import ProductList from '../ProductList';

class BookSearching extends Component {
    state = { productList: [] }

    componentWillMount() {
        console.log('searching info: ' + this.props.match.params.info)
        this.fetchProductSearching(this.props.match.params.info)
    }

    fetchProductSearching(name) {
        get(endpointPublic + "/products/embedded-search/?productName=" + name.trim()).then((response) => {
            if (response.status === 200) {
                this.setState({ productList: response.data });
                console.log("Products: ", response.data)
            }
        }).catch(error => console.log('Error: ' + error));
    }

    render() {
        return (
            <div>
                <h3 className="alert alert-info row" align="center">Tìm kiếm được {this.state.productList.length} kết quả</h3>
                <ProductList productList={this.state.productList} />
            </div>
        );
    }
}

export default withRouter(BookSearching);