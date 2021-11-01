import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { hostML, endpointPublic, get, post } from '../HttpUtils';
import ProductList from '../ProductList';
import ProductSlider from '../ProductSlider';

class BookSearching extends Component {
    state = { productList: [], similarProductIds: [], similarProducts: [] }

    componentWillMount() {
        console.log('searching info: ' + this.props.match.params.info)
        this.fetchProductSearching(this.props.match.params.info).then(() => {
            this.fetchSimilarProductIds().then(() => this.fetchSimilarProducts());
        })
    }

    async fetchProductSearching(name) {
        await get(endpointPublic + "/products/embedded-search/?productName=" + name.trim()).then((response) => {
            if (response.status === 200) {
                this.setState({ productList: response.data });
                console.log("Products: ", response.data)
            }
        }).catch(error => console.log('Error: ' + error));
    }

    async fetchSimilarProductIds() {
        for (let index = 0; index < this.state.productList.length; index++) {
            await get(hostML + "/similar-products?id=" + this.state.productList[index].productId)
                .then((response) => {
                    if (response.status === 200) {
                        let listSimilarProducts = response.data, similar_ids = [];
                        for (let item_list_info of listSimilarProducts) {
                            // Get id of similar products
                            similar_ids.push(item_list_info[0])
                        }
                        // console.log("Similar ids: ", JSON.stringify(similar_ids))
                        this.setState({ similarProductIds: similar_ids });
                    }
                }).catch((error) => console.log("Fetching product by id error: " + error))
        }
    }

    fetchSimilarProducts() {
        let body = { "similarProductIds": this.state.similarProductIds }
        post(endpointPublic + "/products/list-ids", body).then((response) => {
            if (response.status === 200) {
                console.log("Similar products: ", JSON.stringify(response.data))
                this.setState({ similarProducts: response.data });
            }
        }).catch((error) => console.log("Fetching product by id error: " + error))
    }

    render() {
        return (
            <div>
                <h3 className="alert alert-info row" align="center">Tìm kiếm được {this.state.productList.length} kết quả</h3>
                {this.state.similarProducts.length > 0 &&
                    <div >
                        <ProductSlider title="MỌI NGƯỜI CŨNG TÌM KIẾM" productList={this.state.similarProducts} />
                    </div>}
                <br />
                <h3>KẾT QUẢ TÌM ĐƯỢC</h3>
                <ProductList productList={this.state.productList} />
            </div>
        );
    }
}

export default withRouter(BookSearching);