import React, { Component } from 'react';
import { endpointPublic, get, deleteWithAuth, endpointUser } from '../../components/HttpUtils';
import { Button, Container, Row, Col } from 'reactstrap';

class BookManagement extends Component {
    state = { bookList: [] }

    fetchAllPublicBooks() {
        get(endpointPublic + "/books").then((response) => {
            if (response.status === 200) {
                this.setState({ bookList: response.data })
                console.log("Books: ", response.data)
            }
        })
    }

    componentDidMount() {
        this.fetchAllPublicBooks();
    }

    viewDetailBook(id) {
        window.location.replace("http://localhost:3000/admin/book/detail/" + id)
    }

    createNewBook() {
        window.location.replace("http://localhost:3000/admin/book/new")
    }

    render() {
        return (
            <Container >
                <Row style={{ marginTop: "2rem" }}>
                    <h3>Book Management</h3>
                    <Col sm="9" > </Col>
                    <Col>
                        <Button style={{ marginTop: "1rem" }} color="success" onClick={() => this.createNewBook()}>
                            ADD NEW BOOK
                        </Button>
                    </Col>
                </Row>

                <Row style={{ marginTop: "2rem" }}>
                    <Col >
                        <table >
                            <thead>
                                <tr>
                                    <th>Id</th>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Quantity</th>
                                    <th>Discount</th>
                                    <th>Description</th>
                                    <th>Category</th>
                                    <th>Publisher</th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.bookList.map((book) => (
                                    <tr key={book.bookId}>
                                        <td>{book.bookId}</td>
                                        <td>{book.bookName}</td>
                                        <td>{book.unitPrice}</td>
                                        <td>{book.quantity}</td>
                                        <td>{book.discount}</td>
                                        <td>{book.description}</td>
                                        <td>{book.categoryName}</td>
                                        <td>{book.publisherName}</td>
                                        <td><Button color="info" onClick={() => this.viewDetailBook(book.bookId)}>Detail</Button></td>
                                        <td><Button color="danger">Delete</Button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default BookManagement;