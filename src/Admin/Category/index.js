import React, { Component } from 'react';
import { endpointPublic, get, deleteWithAuth, endpointAdmin } from '../../components/HttpUtils';
import { Button, Container, Row, Col } from 'reactstrap';
import CateModal from './CateModal';
import { messages } from '../../components/message';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();
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

    deleteCategory(id) {
        if (window.confirm(messages.deleteConfirm)) {
            deleteWithAuth(endpointAdmin + "/categories/" + id).then((response) => {
                if (response.status === 200) {
                    toast.success(messages.deleteSuccess, {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 1000,
                    });
                    this.fetchCategories();
                }
            }).catch(error => {
                if (error.response) {
                    toast.error(messages.deleteFailed + "Không được xóa thể loại đã có sách!", {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 1000,
                    });
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
                    <h3 className="alert alert-warning" align="center">QUẢN LÝ LOẠI SẢN PHẨM</h3>
                    <Col sm="9"></Col>

                    <Col >
                        <CateModal
                            buttonLabel="Thêm mới"
                            className="insert-button"
                            title="Thêm mới thể loại"
                            color="success"
                            categoryId=""
                            categoryName=""
                            description=""
                            getResultInModal={this.getResultInModal}
                            insertable={true}
                            external={false}
                        >
                            Thêm mới</CateModal>
                    </Col>
                </Row>

                <Row>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Mã thể loại</th>
                                <th>Tên thể loại</th>
                                <th>Mô tả</th>
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
                                    <td><CateModal
                                        buttonLabel="Sửa"
                                        className="edit"
                                        title="Sửa"
                                        color="info"
                                        categoryId={category.categoryId}
                                        categoryName={category.categoryName}
                                        description={category.description}
                                        getResultInModal={this.getResultInModal}
                                        insertable={false}
                                        external={false}
                                    >
                                    </CateModal></td>
                                    <td>
                                        <Button color="danger"
                                            onClick={() => this.deleteCategory(category.categoryId)}>
                                            Xóa
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