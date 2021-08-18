import React, { Component } from 'react';
import { deleteWithAuth, endpointUser, getWithAuth } from '../../components/HttpUtils';
import { Button, Container, Row, Col } from 'reactstrap';
import ModalForm from './PublisherModal';
import './style.css'

class PublisherManagement extends Component {
    state = { publisherList: [], resultInModal: false }

    getResultInModal = (resultModal) => {
        this.setState({ result: resultModal })
    }

    fetchPublishers() {
        getWithAuth(endpointUser + "/publishers").then((response) => {
            if (response.status === 200) {
                this.setState({ publisherList: response.data })
            }
        }).catch((error) => console.log("Fetching publishers error: " + error))
    }

    componentDidMount() {
        this.fetchPublishers();
    }

    deletePublisher(id) {
        if (window.confirm('Do you actually want to delete?')) {
            deleteWithAuth(endpointUser + "/publishers/" + id).then((response) => {
                if (response.status === 200) {
                    alert("Delete publisher successfully!");
                    this.fetchPublishers();
                }
            }).catch(error => {
                if (error.response) {
                    alert(error.response.data.message);
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                }
                console.log("Delete publisher error: " + error);
            })
        } else {
            // Do nothing!
        }
    }

    render() {
        return (
            <Container className="cate-style">
                <Row>
                    <h3 className="alert alert-warning" align="center">Publisher Management</h3>
                    <Col sm="9"></Col>

                    <Col >
                        <ModalForm
                            buttonLabel="ADD NEW ITEM"
                            className="insert-button"
                            title="Add new publisher"
                            color="success"
                            publisherId=""
                            publisherName=""
                            address=""
                            phoneNumber=""
                            getResultInModal={this.getResultInModal}
                            insertable={true}>
                            Add new publisher</ModalForm>
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
                            {this.state.publisherList.map((publisher) => (
                                <tr key={publisher.publisherId}>
                                    <td>{publisher.publisherId}</td>
                                    <td>{publisher.publisherName}</td>
                                    <td>{publisher.address}</td>
                                    <td>{publisher.phoneNumber}</td>

                                    <td><ModalForm
                                        buttonLabel="EDIT"
                                        className="edit"
                                        title="Edit"
                                        color="info"
                                        publisherId={publisher.publisherId}
                                        publisherName={publisher.publisherName}
                                        address={publisher.address}
                                        phoneNumber={publisher.phoneNumber}
                                        getResultInModal={this.getResultInModal}
                                        insertable={false}>
                                    </ModalForm></td>
                                    <td>
                                        <Button color="danger"
                                            onClick={() => this.deletePublisher(publisher.publisherId)}>
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

export default PublisherManagement;