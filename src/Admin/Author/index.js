import React, { Component } from 'react';
import { deleteWithAuth, endpointUser, getWithAuth } from '../../components/HttpUtils';
import { Button, Container, Row, Col } from 'reactstrap';
import ModalForm from './AuthorModal';
import './style.css'
import { messages } from '../../components/message';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();
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
        if (window.confirm(messages.deleteConfirm)) {
            deleteWithAuth(endpointUser + "/authors/" + id).then((response) => {
                if (response.status === 200) {
                    toast.success(messages.deleteSuccess, {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 1000,
                    });
                    this.fetchAuthors();
                }
            }).catch(error => {
                if (error.response) {
                    toast.error(messages.deleteFailed + "Không được xóa tác giả đã có sách!", {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 1000,
                    });
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
                    <h3 className="alert alert-warning" align="center">QUẢN LÝ TÁC GIẢ</h3>
                    <Col sm="9"></Col>

                    <Col >
                        <ModalForm
                            buttonLabel="Thêm mới tác giả"
                            className="insert-button"
                            title="Thêm mới tác giả"
                            color="success"
                            authorId=""
                            authorName=""
                            address=""
                            phoneNumber=""
                            getResultInModal={this.getResultInModal}
                            insertable={true}>
                            Thêm mới tác giả</ModalForm>
                    </Col>
                </Row>

                <Row>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Họ tên</th>
                                <th>Địa chỉ</th>
                                <th>SĐT</th>

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
                                        buttonLabel="Sửa"
                                        className="edit"
                                        title="Sửa"
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
                                            Xoá
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