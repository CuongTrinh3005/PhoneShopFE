import React, { Component } from 'react';
import { deleteWithAuth, endpointUser, getWithAuth } from '../../components/HttpUtils';
import { Button, Container, Row, Col } from 'reactstrap';
import ModalForm from './PublisherModal';
import './style.css'
import { messages } from '../../components/message';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();
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
        if (window.confirm(messages.deleteConfirm)) {
            deleteWithAuth(endpointUser + "/publishers/" + id).then((response) => {
                if (response.status === 200) {
                    toast.success(messages.deleteSuccess, {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 1000,
                    });
                    this.fetchPublishers();
                }
            }).catch(error => {
                if (error.response) {
                    toast.error(messages.deleteFailed + "Không được xóa nhà xuất bản đã có sách!", {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 1000,
                    });
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
                    <h3 className="alert alert-warning" align="center">QUẢN LÝ NHÀ XUẤT BẢN</h3>
                    <Col sm="9"></Col>

                    <Col >
                        <ModalForm
                            buttonLabel="Thêm mới"
                            className="insert-button"
                            title="Thêm mới nhà xuất bản"
                            color="success"
                            publisherId=""
                            publisherName=""
                            address=""
                            phoneNumber=""
                            getResultInModal={this.getResultInModal}
                            insertable={true}>
                            Thêm mới nhà xuất bản</ModalForm>
                    </Col>
                </Row>

                <Row>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Họ tên</th>
                                <th>Địa chỉ</th>
                                <th>Số điện thoại</th>

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
                                        buttonLabel="Sửa"
                                        className="edit"
                                        title="Sửa"
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

export default PublisherManagement;