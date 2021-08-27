import { render } from '@testing-library/react';
import React, { useState, useEffect, Component } from 'react';
import { withRouter, Link, useParams } from 'react-router-dom';
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button, Col, Container, Row
} from 'reactstrap';
import { formatter } from '../Formatter';
import { endpointPublic, get } from '../HttpUtils';
import './book_in_category.css'

class BooksByCategory extends Component {
    state = { bookList: [], category: {} }

    componentDidMount() {
        this.fetchCategoryById(this.props.match.params.id);
        this.fetchBookByCategoryId(this.props.match.params.id);
    }

    fetchBookByCategoryId(id) {
        get(endpointPublic + "/books/category/" + id).then((response) => {
            if (response.status === 200) {
                this.setState({ bookList: response.data })
            }
        })
    }

    fetchCategoryById(id) {
        get(endpointPublic + "/categories/" + id).then((response) => {
            if (response.status === 200) {
                this.setState({ category: response.data })
            }
        })
    }

    render() {
        return (
            <div>
                <Container style={{ height: "2rem" }}>
                    <Row className="parent">
                        <h3 className="alert alert-info" align="center">Sách của thể loại {this.state.category.categoryName}</h3>
                        {this.state.bookList.map((book) => (
                            <Col md="3" className="item" key={book.bookId}>
                                <Card>
                                    {(book.photo === null || book.photo === '')
                                        ? <div><Link to={{ pathname: `/detail/` + book.bookId }}><CardImg style={{ width: "100px" }, { height: "150px" }} src={window.location.origin + '/logo192.png'} alt="Card image cap" /></Link></div>
                                        : <div><Link to={{ pathname: `/detail/` + book.bookId }}><CardImg style={{ width: "100px" }, { height: "150px" }} src={`data:image/jpeg;base64,${book.photo}`} alt="Loading..."></CardImg></Link></div>}

                                    <CardBody>
                                        <CardTitle className="title" tag="h5">{book.bookName}</CardTitle>
                                        <CardSubtitle tag="h6" className="mb-2 text-muted">{formatter.format(book.unitPrice)}</CardSubtitle>
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
            </div>
        );
    }
}

export default withRouter(BooksByCategory);