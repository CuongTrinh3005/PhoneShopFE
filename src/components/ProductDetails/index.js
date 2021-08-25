import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Col, Row, Button, Input, Form, FormGroup, Label } from 'reactstrap';
import { endpointPublic, get } from '../HttpUtils';
import RatingStar from '../RatingStar';
import AvarageRatingStar from '../RatingStar/AvarageRating';
import './detail.css';
import ReactHtmlParser from 'react-html-parser';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

    formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 2
    })

    votingForUser() {
        if (localStorage.getItem("username") !== null || localStorage.getItem("username") !== '') {
            return (
                <div>
                    <h6>For the purpose of enhancing service quality, let us know your rating</h6>
                    <RatingStar bookId={this.props.match.params.id} />
                </div>
            );
        }
    }

    addCartString(str) {
        this.props.addCartString(str);
    }

    async handleOrderQuantity(e) {
        e.preventDefault();

        // Cookie as string
        let cookieStr = "";
        if (cookieStr === "[]") cookieStr = "";

        cookieStr = this.props.match.params.id + "-" + this.state.quantity + "|";

        console.log("Value for cookies: " + cookieStr);
        this.addCartString(cookieStr);

        toast.info("Added to cart!", {
            position: toast.POSITION.TOP_CENTER,
            autoClose: 2000,
        });
    }

    render() {
        return (
            <div>
                <Row style={{ margin: "4rem" }} >
                    <Col md="6" sm="8" className="display-img-info">
                        {this.state.book.photo === null ? <img className="img-prod" alt="Image loading..." src={window.location.origin + '/logo192.png'}>
                        </img> : <img className="img-prod" src={`data:image/jpeg;base64,${this.state.book.photo}`} alt="Image loading..."></img>}
                    </Col>

                    <Col style={{ textAlign: "left" }, { margin: "2rem" }}>
                        <h4>{this.state.book.bookName}</h4>
                        <p><b>Category:</b> {this.state.book.categoryName}</p>
                        {(this.state.book.discount !== null && this.state.book.discount > 0) ?
                            <div>
                                <p><b>Original Price:</b> {this.formatter.format(this.state.book.unitPrice)} </p>
                                <p><strong>Discount: {this.state.book.discount * 100}%</strong></p>
                                <p><strong>Price after discounting: {this.formatter.format((1 - this.state.book.discount) * this.state.book.unitPrice)}</strong></p>
                            </div>
                            :
                            <p>{this.formatter.format(this.state.book.unitPrice)} </p>
                        }
                        {/* <p>Status: {this.state.book.available === true & <p>NOT AVAILABLE</p>}</p> */}

                        <AvarageRatingStar bookId={this.props.match.params.id} />
                        <br />

                        <Form onSubmit={(e) => this.handleOrderQuantity(e)}>
                            <FormGroup>
                                <Label for="quantity">Quantity</Label>
                                <Input type="number" name="quantity" id="quantity" style={{ width: "5rem" }}
                                    placeholder="Quantity" min="1" defaultValue="0" value={this.state.quantity}
                                    onChange={e => this.setState({ quantity: e.target.value })} />
                            </FormGroup>
                            <Button style={{ marginTop: "2rem" }} color="primary">ADD TO CART</Button>
                        </Form>
                    </Col>
                    <hr />
                </Row>

                <Row>
                    <h2>DETAIL INFO</h2>
                    <br />
                    <table id="table">
                        <tbody>
                            <tr>
                                <td>Publisher Name</td>
                                <td>{this.state.book.publisherName}</td>
                            </tr>
                            <tr>
                                <td>Author Name</td>
                                <td>{this.state.authorNames.join(', ')}</td>
                            </tr>
                            {/* <tr>
                                <td>Depiction</td>
                                <td>{ReactHtmlParser(this.state.book.specification)}</td>
                            </tr> */}
                        </tbody>
                    </table>
                    <br />
                    <hr />
                </Row>

                <Row>
                    <h2>SPECIFICATION</h2>
                    <p>{ReactHtmlParser(this.state.book.specification)}</p>
                    <hr />
                    <h2>DESCRIPTION</h2>
                    <p>{ReactHtmlParser(this.state.book.description)}</p>
                    <hr />
                    <h6>For the purpose of good serving, please vote for this book</h6>
                    <RatingStar bookId={this.props.match.params.id} />
                </Row>
            </div>
        );
    }
}

export default withRouter(Detail);