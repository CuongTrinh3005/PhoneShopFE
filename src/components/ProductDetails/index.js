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
    state = { book: {}, authorIds: [], authorNames: [], quantity: 1, cookieValue: "" }

    componentDidMount() {
        this.fetchBookById().then(() => this.fetchAuthorById());
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'smooth'
        });
    }

    async fetchBookById() {
        await get(endpointPublic + "/books/" + this.props.match.params.id).then((response) => {
            if (response.status === 200) {
                this.setState({ book: response.data })
                this.setState({ authorIds: response.data.authorIds })
            }
        }).catch((error) => console.log("Fetching book by id error: " + error))
    }

    fetchAuthorById() {
        for (let index = 0; index < this.state.authorIds.length; index++) {
            get(endpointPublic + "/authors/" + this.state.authorIds[index]).then((response) => {
                if (response.status === 200) {
                    var newState = this.state.authorNames.concat(response.data.authorName);
                    this.setState({ authorNames: newState })
                }
            })
        }
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
        if (cookieStr === "[]") cookieStr = "";

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
                <Row style={{ margin: "4rem" }} >
                    <Col md="6" sm="8" className="display-img-info">
                        <div style={{ width: "100px" }, { height: "200px" }, { marginTop: "2.5rem" }}>
                            {this.state.book.photo === null ? <img className="img-prod" alt="Image loading..." src={window.location.origin + '/logo192.png'}>
                            </img> : <img className="img-prod" width="100px" height="100%" src={`data:image/jpeg;base64,${this.state.book.photo}`} alt="Image loading..."></img>}
                        </div>
                    </Col>

                    <Col style={{ textAlign: "left" }, { margin: "2rem" }}>
                        <h4>{this.state.book.bookName}</h4>
                        <p><b>Thể loại:</b> {this.state.book.categoryName}</p>
                        {(this.state.book.discount !== null && this.state.book.discount > 0) ?
                            <div>
                                <p><b>Đơn giá:</b> {formatter.format(this.state.book.unitPrice)} </p>
                                <p><strong>Khuyến mãi: {this.state.book.discount * 100}%</strong></p>
                                <p><strong>Giá cuối cùng: {formatter.format((1 - this.state.book.discount) * this.state.book.unitPrice)}</strong></p>
                            </div>
                            :
                            <p>{formatter.format(this.state.book.unitPrice)} </p>
                        }

                        <AvarageRatingStar bookId={this.props.match.params.id} />
                        <br />

                        <Form onSubmit={(e) => this.handleOrderQuantity(e)}>
                            <FormGroup>
                                <Label for="quantity">Quantity</Label>
                                <Input type="number" name="quantity" id="quantity" style={{ width: "5rem" }}
                                    placeholder="Quantity" min="1" defaultValue="0" value={this.state.quantity}
                                    onChange={e => this.setState({ quantity: e.target.value })} />
                            </FormGroup>
                            <Button style={{ marginTop: "2rem" }} color="primary">Thêm vào giỏ hàng</Button>
                        </Form>
                    </Col>
                    <hr />
                </Row>

                <Row>
                    <h2>THÔNG TIN CHI TIẾT</h2>
                    <br />
                    <table id="table">
                        <tbody>
                            <tr>
                                <td>Nhà xuất bản</td>
                                <td>{this.state.book.publisherName}</td>
                            </tr>
                            <tr>
                                <td>Tác giả</td>
                                <td>{this.state.authorNames.join(', ')}</td>
                            </tr>
                        </tbody>
                    </table>
                    <br />
                    <hr />
                </Row>

                <Row>
                    <h2>THÔNG SỐ KỸ THUẬT</h2>
                    <p>{ReactHtmlParser(this.state.book.specification)}</p>
                    <hr />
                    <h2>MÔ TẢ CHI TIẾT</h2>
                    <p>{ReactHtmlParser(this.state.book.description)}</p>
                </Row>
            </div>
        );
    }
}

export default withRouter(Detail);