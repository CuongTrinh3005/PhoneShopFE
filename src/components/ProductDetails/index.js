import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Col, Row, Button, Input, Form, FormGroup, Label } from 'reactstrap';
import { endpointPublic, get, post, hostML } from '../HttpUtils';
import AvarageRatingStar from '../RatingStar/AvarageRating';
import './detail.css';
import ReactHtmlParser from 'react-html-parser';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { formatter } from '../../components/Formatter';
import { messages } from '../message';
import ProductList from '../ProductList';
import RatingModal from '../RatingStar/RatingModal';

toast.configure();
class Detail extends Component {
    state = { product: {}, quantity: 1, cookieValue: "", similarProductIds: [], similarProducts: [] }

    componentDidMount() {
        this.fetchproductById();
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

        toast.info("Đã thêm vào giỏ hàng!", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000,
        });
    }

    renderPhone() {
        return (
            <tbody>
                {this.state.product.model !== null || this.state.product.model !== undefined || this.state.product.model !== '' &&
                    <tr>
                        <td>Model</td>
                        <td>{this.state.product.model}</td>
                    </tr>
                }
                <tr>
                    <td>IMEI Number</td>
                    <td>{this.state.product.imeiNo}</td>
                </tr>
                <tr>
                    <td>RAM</td>
                    <td>{this.state.product.ram} GB</td>
                </tr>
                <tr>
                    <td>Dung lượng PIN</td>
                    <td>{this.state.product.batteryPower} mAh</td>
                </tr>
                <tr>
                    <td>Bộ nhớ trong</td>
                    <td>{this.state.product.inMemory} GB</td>
                </tr>
                <tr>
                    <td>Màn hình cảm ứng</td>
                    <td>{this.state.product.touchScreen && 'Có'}</td>
                </tr>
                <tr>
                    <td>Wifi</td>
                    <td>{this.state.product.wifi && 'Có'}</td>
                </tr>
                <tr>
                    <td>Bluetooth</td>
                    <td>{this.state.product.bluetooth && 'Có'}</td>
                </tr>
                <tr>
                    <td>Xung nhịp</td>
                    <td>{this.state.product.clockSpeed} GHz</td>
                </tr>
                <tr>
                    <td>Số lượng nhân</td>
                    <td>{this.state.product.n_cores}</td>
                </tr>
                <tr>
                    <td>Số lượng sim</td>
                    <td>{this.state.product.n_sim}</td>
                </tr>
                <tr>
                    <td>Độ phân giải</td>
                    <td>{this.state.product.pxHeight} x {this.state.product.pxWidth} Pixels</td>
                </tr>
                <tr>
                    <td>Màn hình</td>
                    <td>{this.state.product.screenHeight !== this.state.product.screenWidth ? this.state.product.screenHeight + " inch x" + this.state.product.screenWidth + " inch"
                        : this.state.product.screenHeight + " inch"}</td>
                </tr>
                <tr>
                    <td>Refresh Rate</td>
                    <td>{(this.state.product.refreshRate !== null && this.state.product.refreshRate !== 0) ? this.state.product.refreshRate + " Hz" : ''}</td>
                </tr>
                <tr>
                    <td>Camera trước</td>
                    <td>{this.state.product.frontCam} MP</td>
                </tr>
                <tr>
                    <td>Hỗ trợ 3G</td>
                    <td>{this.state.product.support_3G ? 'Có' : 'Không'}</td>
                </tr>
                <tr>
                    <td>Hỗ trợ 4G</td>
                    <td>{this.state.product.support_4G ? 'Có' : 'Không'}</td>
                </tr>
                <tr>
                    <td>Hỗ trợ 5G</td>
                    <td>{this.state.product.support_5G ? 'Có' : 'Không'}</td>
                </tr>
            </tbody>
        );
    }

    renderAccessory() {
        return (
            <tbody>
                {this.state.product.compatibleDevices !== null && this.state.product.compatibleDevices !== undefined && this.state.product.compatibleDevices !== '' &&
                    <tr>
                        <td>Khả năng tương thích</td>
                        <td>{this.state.product.compatibleDevices}</td>
                    </tr>
                }
                <tr>
                    <td>Chức năng</td>
                    <td>{this.state.product.functions}</td>
                </tr>
            </tbody>
        );
    }

    render() {
        return (
            <div>
                <h3 align="center" style={{ marginTop: "2rem" }}>CHI TIẾT SẢN PHẨM</h3>
                <Row style={{ margin: "4rem" }} >
                    <Col md="6" sm="8" className="display-img-info">
                        <div style={{ width: "100px" }, { height: "200px" }, { marginTop: "2.5rem" }}>
                            {this.state.product.image === null ? <img className="img-prod" alt="Image loading..." src={window.location.origin + '/product-default.png'}>
                            </img> : <img className="img-prod" width="100px" height="100%" src={`data:image/jpeg;base64,${this.state.product.image}`} alt="Image loading..."></img>}
                        </div>
                    </Col>

                    <Col style={{ textAlign: "left" }, { margin: "2rem" }}>
                        <h4>{this.state.product.productName}</h4>
                        <p><b>Loại sản phẩm:</b> {this.state.product.categoryName}</p>
                        <p><b>Nhà sản xuất :</b> {this.state.product.manufacturerName}</p>
                        <p><b>Thương hiệu  :</b> {this.state.product.brandName}</p>
                        {(this.state.product.discount !== null && this.state.product.discount > 0) ?
                            <div>
                                <p><b>Đơn giá:</b> {formatter.format(this.state.product.unitPrice)} </p>
                                <p><strong>Khuyến mãi: {this.state.product.discount * 100}%</strong></p>
                                <p><strong>Giá cuối cùng: {formatter.format((1 - this.state.product.discount) * this.state.product.unitPrice)}</strong></p>
                            </div>
                            :
                            <p>{formatter.format(this.state.product.unitPrice)} </p>
                        }
                        {(this.state.product.available === false || this.state.product.quantity === 0) &&
                            <strong>Hiện sản phẩm tạm ngưng cung cấp</strong>
                        }
                        {this.state.product.special === true &&
                            <strong>Hàng đặc biệt</strong>
                        }

                        <AvarageRatingStar productId={this.props.match.params.id} />
                        <br />

                        <Form onSubmit={(e) => this.handleOrderQuantity(e)}>
                            <FormGroup>
                                <Label for="quantity">Số lượng đặt</Label>
                                <Input type="number" name="quantity" id="quantity" style={{ width: "5rem" }}
                                    placeholder="Số lượng" min="1" defaultValue="0" value={this.state.quantity}
                                    onChange={e => this.setState({ quantity: e.target.value })} />
                            </FormGroup>
                            <Button style={{ marginTop: "2rem" }} color="primary"
                                disabled={this.state.product.available === false || this.state.product.quantity === 0}
                            >Thêm vào giỏ hàng</Button>
                        </Form>
                    </Col>
                    <hr />
                </Row>

                <Row>
                    <h2>THÔNG TIN CHI TIẾT</h2>
                    <br />
                    <table id="table">
                        {this.state.product.type === 1 ? this.renderPhone() : this.renderAccessory()}
                    </table>
                    <hr />
                    <br />
                    {this.state.product.otherSpecification !== null && this.state.product.otherSpecification !== '' ?
                        <div>
                            <h5>CÁC THÔNG SỐ KỸ THUẬT KHÁC</h5>
                            <p>{ReactHtmlParser(this.state.product.otherSpecification)}</p></div>
                        : null
                    }
                    <hr />
                </Row>

                <Row>
                    <h2>MÔ TẢ CHI TIẾT</h2>
                    <p>{ReactHtmlParser(this.state.product.description)}</p>
                </Row>

                <Row>
                    <div className="rating-section">
                        <h2>ĐÁNH GIÁ CHẤT LƯỢNG SẢN PHẨM</h2>
                        <RatingModal className="rating-modal" productId={this.props.match.params.id} />
                    </div>
                    <hr />
                </Row>

                <Row style={{ marginTop: "2rem" }}>
                    {this.state.similarProducts.length !== 0
                        && <ProductList title="GỢI Ý SẢN PHẨM" productList={this.state.similarProducts} />
                    }
                </Row>
            </div>
        );
    }
}

export default withRouter(Detail);