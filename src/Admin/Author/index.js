import React, { Component } from 'react';
import { deleteWithAuth, endpointUser, getWithAuth } from '../../components/HttpUtils';
import { Button, Container, Row, Col } from 'reactstrap';
import ModalForm from './AuthorModal';
import './style.css'

class AuthorManagement extends Component {
    state = { authorList: [], resultInModal: false }

    getResultInModal = (resultModal) => {
        this.setState({ result: resultModal })
    }

    fetchAuthors() {
        getWithAuth(endpointUser + "/authors").then((response) => {
            if (response.status === 200) {
                this.setState({ authorList: response.data })
            }
        }).catch((error) => console.log("Fetching authors error: " + error))
    }

    componentDidMount() {
        this.fetchAuthors();
    }

    deleteAuthor(id) {
        if (window.confirm('Do you actually want to delete?')) {
            deleteWithAuth(endpointUser + "/authors/" + id).then((response) => {
                if (response.status === 200) {
                    alert("Delete author successfully!");
                    this.fetchAuthors();
                }
            }).catch(error => {
                if (error.response) {
                    alert(error.response.data.message)
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                }
                console.log("Delete author error: " + error);
            })
        } else {
            // Do nothing!
        }
    }

    render() {
        return (
            <Container className="cate-style">
                <Row>
                    <h3 className="alert alert-warning" align="center">Author Management</h3>
                    <Col sm="9"></Col>

                    <Col >
                        <ModalForm
                            buttonLabel="ADD NEW ITEM"
                            className="insert-button"
                            title="Add new author"
                            color="success"
                            authorId=""
                            authorName=""
                            address=""
                            phoneNumber=""
                            getResultInModal={this.getResultInModal}
                            insertable={true}>
                            Add new author</ModalForm>
                    </Col>
                </Row>

                <Row>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Address</th>
                                <th>Phone Number</th>

                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.authorList.map((author) => (
                                <tr key={author.authorId}>
                                    <td>{author.authorId}</td>
                                    <td>{author.authorName}</td>
                                    <td>{author.address}</td>
                                    <td>{author.phoneNumber}</td>

                                    <td><ModalForm
                                        buttonLabel="EDIT"
                                        className="edit"
                                        title="Edit"
                                        color="info"
                                        authorId={author.authorId}
                                        authorName={author.authorName}
                                        address={author.address}
                                        phoneNumber={author.phoneNumber}
                                        getResultInModal={this.getResultInModal}
                                        insertable={false}>
                                    </ModalForm></td>
                                    <td>
                                        <Button color="danger"
                                            onClick={() => this.deleteAuthor(author.authorId)}>
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Row>

            </Container>
        );
    }
}

export default AuthorManagement;