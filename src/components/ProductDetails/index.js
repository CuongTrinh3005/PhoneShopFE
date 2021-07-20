import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Col, Row } from 'reactstrap';
import { endpointPublic, get } from '../HttpUtils';
import './detail.css';

class Detail extends Component {
    state = { book: {}, authorIds: [], authorNames: [] }

    componentDidMount() {
        this.fetchBookById().then(() => this.fetchAuthorById());
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

    render() {
        return (
            <div>
                <Row style={{ margin: "4rem" }} >
                    <Col md="6" sm="8">
                        {this.state.book.photo === null ? <img className="img-prod" alt="Image loading..." src={window.location.origin + '/logo192.png'}>
                        </img> : <img className="img-prod" src={`data:image/jpeg;base64,${this.state.book.photo}`} alt="Image loading..."></img>}
                    </Col>

                    <Col style={{ textAlign: "left" }, { margin: "2rem" }}>
                        {/* <h1>Book details {this.props.match.params.id}</h1> */}
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
                        {/* <p>Available: {this.state.book.available === true & <p>True</p>}</p> */}
                    </Col>
                    <hr />
                </Row>

                <Row>
                    <h2>DETAIL INFO</h2>
                    <br />
                    <table>
                        <tbody>
                            <tr>
                                <td>Publisher Name</td>
                                <td>{this.state.book.publisherName}</td>
                            </tr>
                            <tr>
                                <td>Author Name</td>
                                <td>{this.state.authorNames.join(', ')}</td>
                            </tr>
                            <tr>
                                <td>Depiction</td>
                                <td>{this.state.book.specification}</td>
                            </tr>
                        </tbody>
                    </table>
                    <br />
                    <hr />
                </Row>

                <Row>
                    <h2>DESCRIPTION</h2>
                    <p>{this.state.book.description}</p>
                </Row>
            </div>
        );
    }
}

export default withRouter(Detail);