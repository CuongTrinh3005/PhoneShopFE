import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button, Col, Container, Row
} from 'reactstrap';
import { endpointPublic, get } from '../HttpUtils';
import './feature.css'

class FeatureFilter extends Component {
    state = { bookList: [], filterBy: "" }

    componentDidMount() {
        if (this.props.match.params.filter === 'new') {
            this.setState({ filterBy: "new" })
            this.fetchNewBooks();
        }
        else if (this.props.match.params.filter === 'discounting') {
            this.setState({ filterBy: "discounting" })
            this.fetchDiscountingBooks();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state !== prevState) {
            if (this.props.match.params.filter === 'new') {
                this.fetchNewBooks();
            }
            else if (this.props.match.params.filter === 'discounting') {
                this.fetchDiscountingBooks();
            }
        }
    }

    fetchNewBooks() {
        get(endpointPublic + "/books/new").then((response) => {
            if (response.status === 200) {
                this.setState({ bookList: response.data })
            }
        })
    }

    fetchDiscountingBooks() {
        get(endpointPublic + "/books/discounting").then((response) => {
            if (response.status === 200) {
                this.setState({ bookList: response.data })
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
            <div >
                <Container style={{ height: "2rem" }}>
                    <Row style={{ marginTop: "4rem" }}>
                        {this.props.match.params.filter === 'new' ? <h5>NEW BOOKS</h5> : <h5>ON-SALE BOOKS</h5>}

                        {this.state.bookList.map((book) => (
                            <Col md="3" className="item" key={book.bookId}>
                                <Card>
                                    {/* <CardImg top width="10%" src={window.location.origin + '/logo192.png'} alt="Card image cap" /> */}
                                    {book.photo === null
                                        ? <div><CardImg style={{ width: "100px" }, { height: "100px" }} src={window.location.origin + '/logo192.png'} alt="Card image cap" /></div>
                                        : <div><CardImg style={{ width: "100px" }, { height: "100px" }} src={`data:image/jpeg;base64,${book.photo}`} alt="Loading..."></CardImg></div>}

                                    <CardBody>
                                        <CardTitle className="title" tag="h5">{book.bookName}</CardTitle>
                                        <CardSubtitle tag="h6" className="mb-2 text-muted">{this.formatter.format(book.unitPrice)}</CardSubtitle>
                                        <CardText></CardText>
                                        <Link to={{ pathname: `/detail/` + book.bookId }}>
                                            <Button color="info">View details</Button>
                                        </Link>

                                    </CardBody>
                                </Card>
                            </Col>
                        ))}
                    </Row>
                </Container>
            </div >
        );
    }
};


export default withRouter(FeatureFilter);