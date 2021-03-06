import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Col, Row, Button, Input, Form, FormGroup, Label } from 'reactstrap';
import { endpointPublic, get, post, getWithAuth, putWithAuth, postwithAuth, hostML, endpointUser } from '../HttpUtils';
import AvarageRatingStar from '../RatingStar/AvarageRating';
import './detail.css';
import ReactHtmlParser from 'react-html-parser';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { formatter } from '../../components/Formatter';
import { messages } from '../message';
import ProductList from '../ProductList';
import RatingModal from '../RatingStar/RatingModal';
import ProductSlider from '../ProductSlider';

toast.configure();
window.addEventListener('hashchange', function () {
    console.log('location changed!');
})
class Detail extends Component {
    state = {
        product: {}, quantity: 1, cookieValue: "", similarProductIds: [], similarProducts: []
        , accesssoryList: []
    }

    componentDidMount() {
        this.fetchproductById();
        this.mergeViewingHistory();
        this.fetchSimilarProductIds().then(() => this.fetchSimilarProducts());
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }

    fetchproductById() {
        get(endpointPublic + "/products/" + this.props.match.params.id).then((response) => {
            if (response.status === 200) {
                this.setState({ product: response.data })
                if (response.data.numAccessories > 0)
                    this.fetchAccessoriesOfPhone();
            }
        }).catch((error) => console.log("Fetching product by id error: " + error))
    }

    fetchAccessoriesOfPhone() {
        get(endpointPublic + "/products/" + this.props.match.params.id + "/list-accessories").then((response) => {
            if (response.status === 200) {
                this.setState({ accesssoryList: response.data })
            }
        }).catch((error) => console.log("Fetching product by id error: " + error))
    }

    mergeViewingHistory() {
        let userId = localStorage.getItem('userId');
        let productId = this.props.match.params.id;
        if (userId === null || userId === undefined || userId === '')
            return;

        getWithAuth(endpointUser + "/viewing-histories/check-exist?userId=" + userId + "&productId=" + productId)
            .then((response) => {
                if (response.status === 200) {
                    let existed = response.data;
                    if (existed) {
                        putWithAuth(endpointUser + "/viewing-histories?userId=" + userId + "&productId=" + productId, {})
                            .then((response) => {
                                if (response.status === 200) {
                                    console.log("Increased view count in view history");
                                }
                            }).catch((error) => console.log("Fetching product by id error: " + error))
                    }
                    else {
                        let viewHistoryId = {
                            "userId": userId,
                            "productId": productId
                        }
                        let body = { "viewHistoryId": viewHistoryId }
                        postwithAuth(endpointUser + "/viewing-histories?userId=" + userId + "&productId=" + productId, body)
                            .then((response) => {
                                if (response.status === 200) {
                                    console.log("Created new view history");
                                }
                            }).catch((error) => console.log("Fetching product by id error: " + error))
                    }

                }
            }).catch((error) => console.log("Fetching product by id error: " + error))

    }

    async fetchSimilarProductIds() {
        await get(hostML + "/similar-products?id=" + this.props.match.params.id).then((response) => {
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
        // window.scrollTo({
        //     top: 0,
        //     left: 0,
        //     behavior: 'smooth'
        // });
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

    addCartString(str) {
        this.props.addCartString(str);
    }

    async handleOrderQuantity(e) {
        e.preventDefault();
        const username = localStorage.getItem('username');
        if (username === null || username === undefined || username === '') {
            toast.warning(messages.loginToProceed, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
            });
            return;
        }

        // Cookie as string
        let cookieStr = "";
        // if (cookieStr === "[]") cookieStr = "";

        cookieStr = this.props.match.params.id + "-" + this.state.quantity + "|";

        console.log("Value for cookies: " + cookieStr);
        this.addCartString(cookieStr);

        toast.info("???? th??m v??o gi??? h??ng!", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000,
        });
    }

    render() {
        return (
            <div>
                <h3 align="center" style={{ marginTop: "2rem" }}>CHI TI???T S???N PH???M</h3>
                <Row style={{ margin: "4rem" }} >
                    <Col md="6" sm="8" className="display-img-info">
                        <div style={{ width: "100px" }, { height: "200px" }, { marginTop: "2.5rem" }}>
                            {this.state.product.image === null ? <img className="img-prod" alt="Image loading..." src={window.location.origin + '/product-default.png'}>
                            </img> : <img className="img-prod" width="100px" height="100%" src={`data:image/jpeg;base64,${this.state.product.image}`} alt="Image loading..."></img>}
                        </div>
                    </Col>

                    <Col style={{ textAlign: "left" }, { margin: "2rem" }}>
                        <h4>{this.state.product.productName}</h4>
                        <p><b>Lo???i s???n ph???m:</b> {this.state.product.categoryName}</p>
                        <p><b>Nh?? s???n xu???t :</b> {this.state.product.manufacturerName}</p>
                        <p><b>Th????ng hi???u  :</b> {this.state.product.brandName}</p>
                        {(this.state.product.discount !== null && this.state.product.discount > 0) ?
                            <div>
                                <p><b>????n gi??:</b> {formatter.format(this.state.product.unitPrice)} </p>
                                <p><strong>Khuy???n m??i: {this.state.product.discount * 100}%</strong></p>
                                <p><strong>Gi?? cu???i c??ng: {formatter.format((1 - this.state.product.discount) * this.state.product.unitPrice)}</strong></p>
                            </div>
                            :
                            <p>{formatter.format(this.state.product.unitPrice)} </p>
                        }
                        {(this.state.product.available === false || this.state.product.quantity === 0) &&
                            <strong>Hi???n s???n ph???m t???m ng??ng cung c???p</strong>
                        }
                        {this.state.product.special === true &&
                            <strong>H??ng ?????c bi???t</strong>
                        }

                        <AvarageRatingStar productId={this.props.match.params.id} />
                        <br />

                        <Form onSubmit={(e) => this.handleOrderQuantity(e)}>
                            <FormGroup>
                                <Label for="quantity">S??? l?????ng ?????t</Label>
                                <Input type="number" name="quantity" id="quantity" style={{ width: "5rem" }}
                                    placeholder="S??? l?????ng" min="1" defaultValue="0" value={this.state.quantity}
                                    onChange={e => this.setState({ quantity: e.target.value })} />
                            </FormGroup>
                            <Button style={{ marginTop: "2rem" }} color="primary"
                                disabled={this.state.product.available === false || this.state.product.quantity === 0}
                            >Th??m v??o gi??? h??ng</Button>
                        </Form>
                    </Col>
                    <hr />
                </Row>

                <Row style={{ marginTop: "2rem" }}>
                    {this.state.accesssoryList.length > 0 &&
                        <div >
                            <ProductSlider title="PH??? KI???N ??I K??M"
                                productList={this.state.accesssoryList} reload={true} />
                        </div>}
                </Row>

                <Row style={{ marginTop: "2rem" }}>
                    {this.state.similarProducts.length > 0 &&
                        <div >
                            <ProductSlider title="C??C S???N PH???M T????NG T???"
                                productList={this.state.similarProducts} reload={true} />
                        </div>}
                </Row>

                <Row>
                    {this.state.product.specification !== null && this.state.product.specification !== '' ?
                        <div>
                            <h2>TH??NG TIN CHI TI???T</h2>
                            <br />

                            <div>
                                {ReactHtmlParser(this.state.product.specification)}
                            </div>
                        </div>
                        : null
                    }

                    <hr />
                </Row>

                <Row>
                    <h2>M?? T??? CHI TI???T</h2>
                    <p>{ReactHtmlParser(this.state.product.description)}</p>
                </Row>

                {/* <Row>
                    <div className="rating-section">
                        <h2>????NH GI?? CH???T L?????NG S???N PH???M</h2>
                        <RatingModal className="rating-modal" productId={this.props.match.params.id} />
                    </div>
                    <hr />
                </Row> */}
            </div>
        );
    }
}

export default withRouter(Detail);