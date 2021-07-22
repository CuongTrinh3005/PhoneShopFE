import React, { Component } from 'react';
import { endpointPublic, get, deleteWithAuth, endpointUser } from '../../components/HttpUtils';
import { Button, Container, Row, Col } from 'reactstrap';
import ModalForm from './CateModal';

class CategoryManagement extends Component {
    state = { categoryList: [], resultInModal: false }

    getResultInModal = (resultModal) => {
        this.setState({ result: resultModal })
    }

    fetchCategories() {
        get(endpointPublic + "/categories").then((response) => {
            if (response.status === 200) {
                this.setState({ categoryList: response.data })
            }
        }).catch((error) => console.log("Fetching categories error: " + error))
    }

    componentDidMount() {
        this.fetchCategories();
    }

    componentDidUpdate() {
        this.fetchCategories();
    }

    deleteCategory(id) {
        if (window.confirm('Do you actually want to delete?')) {
            deleteWithAuth(endpointUser + "/categories/" + id).then((response) => {
                if (response.status === 200) {
                    alert("Delete category successfully!");
                }
            }).catch(error => {
                if (error.response) {
                    alert(error.response.data.message)
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                }
                console.log("Delete category error: " + error);
            })
        } else {
            // Do nothing!
        }
    }

    render() {
        return (
            <Container className="cate-style">
                <Row>
                    <h3>Category Management</h3>
                    <Col sm="9"></Col>

                    <Col >
                        <ModalForm
                            buttonLabel="ADD NEW ITEM"
                            className="insert-button"
                            title="Add new item"
                            color="success"
                            categoryId=""
                            categoryName=""
                            description=""
                            getResultInModal={this.getResultInModal}
                            insertable={true}>
                            Add new category</ModalForm>
                    </Col>
                </Row>

                <Row>
                    <table>
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Description</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.categoryList.map((category) => (
                                <tr key={category.categoryId}>
                                    <td>{category.categoryId}</td>
                                    <td>{category.categoryName}</td>
                                    <td>{category.description}</td>
                                    <td><ModalForm
                                        buttonLabel="EDIT"
                                        className="edit"
                                        title="Edit"
                                        color="info"
                                        categoryId={category.categoryId}
                                        categoryName={category.categoryName}
                                        description={category.description}
                                        getResultInModal={this.getResultInModal}
                                        insertable={false}>
                                    </ModalForm></td>
                                    <td>
                                        <Button color="danger"
                                            onClick={() => this.deleteCategory(category.categoryId)}>
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

export default CategoryManagement;