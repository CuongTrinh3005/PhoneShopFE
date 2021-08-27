import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import {
    Card, CardImg, CardText, CardBody,
    CardTitle, CardSubtitle, Button, Col, Container, Row
} from 'reactstrap';
import { formatter } from '../Formatter';
import { endpointPublic, get } from '../HttpUtils';

class BookSearching extends Component {
    state = { bookList: [] }

    componentWillMount() {
        console.log('searching info: ' + this.props.match.params.info)
        this.fetchBookSearching(this.props.match.params.info)
    }

    fetchBookSearching(name) {
        get(endpointPublic + "/books/search/?name=" + name.trim()).then((response) => {
            if (response.status === 200) {
                this.setState({ bookList: response.data });
                console.log("Books: ", response.data)
            }
        }).catch(error => console.log('Error: ' + error));
    }

    render() {
        return (
            <div>
                <Container style={{ marginTop: "2rem" }}>
                    <Row className="parent">
                        <h3 className="alert alert-info" align="center">Tìm kiếm được {this.state.bookList.length} kết quả</h3>
                        {this.state.bookList.map((book) => (
                            <Col md="3" className="item" key={book.bookId}>
                                <Card>
                                    {(book.photo === null || book.photo === '')
                                        ? <div><Link to={{ pathname: `/detail/` + book.bookId }}><CardImg style={{ width: "100px" }, { height: "200px" }} src={window.location.origin + '/logo192.png'} alt="Card image cap" /></Link></div>
                                        : <div><Link to={{ pathname: `/detail/` + book.bookId }}><CardImg style={{ width: "100px" }, { height: "200px" }} src={`data:image/jpeg;base64,${book.photo}`} alt="Loading..."></CardImg></Link></div>}

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

export default withRouter(BookSearching);