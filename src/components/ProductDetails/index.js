import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Col, Row, Button, Input, Form, FormGroup, Label } from 'reactstrap';
import { endpointPublic, get } from '../HttpUtils';
import AvarageRatingStar from '../RatingStar/AvarageRating';
import './detail.css';
import ReactHtmlParser from 'react-html-parser';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { formatter } from '../../components/Formatter';
import { messages } from '../message';

toast.configure();
class Detail extends Component {
    state = { product: {}, quantity: 1, cookieValue: "" }

    componentDidMount() {
        this.fetchproductById();
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
                console.log("Product: " + JSON.stringify(response.data));
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
                                <Label for="quantity">Số lượng</Label>
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
                    {/* <h2>THÔNG TIN CHI TIẾT</h2>
                    <br /> */}
                    {/* <table id="table">
                        <tbody>
                            <tr>
                                <td>Nhà xuất bản</td>
                                <td>{this.state.product.publisherName}</td>
                            </tr>
                            <tr>
                                <td>Tác giả</td>
                                <td>{this.state.authorNames.join(', ')}</td>
                            </tr>
                        </tbody>
                    </table> */}
                    <br />
                    <hr />
                </Row>

                <Row>
                    <h2>THÔNG SỐ KỸ THUẬT</h2>
                    <p>{ReactHtmlParser(this.state.product.specification)}</p>
                    <hr />
                    <h2>MÔ TẢ CHI TIẾT</h2>
                    <p>{ReactHtmlParser(this.state.product.description)}</p>
                </Row>
            </div>
        );
    }
}

export default withRouter(Detail);