import React, { Component } from 'react';
import { deleteWithAuth, endpointAdmin, endpointPublic, endpointUser, getWithAuth } from '../../components/HttpUtils';
import { Button, Container, Row, Col } from 'reactstrap';
import ManufacturerModal from './ManufacturerModal';
import './style.css'
import { messages } from '../../components/message';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();
class ManufacturerManagement extends Component {
    state = { manufacturerList: [], resultInModal: false }

    getResultInModal = (resultModal) => {
        this.setState({ result: resultModal })
    }

    fetchManufacturers() {
        getWithAuth(endpointPublic + "/manufacturers").then((response) => {
            if (response.status === 200) {
                this.setState({ manufacturerList: response.data })
            }
        }).catch((error) => console.log("Fetching authors error: " + error))
    }

    componentDidMount() {
        this.fetchManufacturers();
    }

    deleteManufacturer(id) {
        if (window.confirm(messages.deleteConfirm)) {
            deleteWithAuth(endpointAdmin + "/manufacturers/" + id).then((response) => {
                if (response.status === 200) {
                    toast.success(messages.deleteSuccess, {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 1000,
                    });
                    this.fetchManufacturers();
                }
            }).catch(error => {
                if (error.response) {
                    toast.error(messages.deleteFailed + "Không được xóa nhà sản xuất đã có sản phẩm!", {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 1500,
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
                    <h3 className="alert alert-warning" align="center">QUẢN LÝ NHÀ SẢN XUẤT</h3>
                    <Col sm="9"></Col>

                    <Col >
                        <ManufacturerModal
                            buttonLabel="Thêm mới nhà sản xuất"
                            className="insert-button"
                            title="Thêm mới nhà sản xuất"
                            color="success"
                            manufacturerId=""
                            manufacturerName=""
                            email=""
                            address=""
                            phoneNumber=""
                            country=""
                            getResultInModal={this.getResultInModal}
                            insertable={true}
                            external={false}>
                            Thêm mới nhà sản xuất</ManufacturerModal>
                    </Col>
                </Row>

                <Row>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên nhà sản xuất</th>
                                <th>Email</th>
                                <th>Địa chỉ</th>
                                <th>SĐT</th>
                                <th>Quốc gia</th>

                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.manufacturerList.map((manufacturer) => (
                                <tr key={manufacturer.manufacturerId}>
                                    <td>{manufacturer.manufacturerId}</td>
                                    <td>{manufacturer.manufacturerName}</td>
                                    <td>{manufacturer.email}</td>
                                    <td>{manufacturer.address}</td>
                                    <td>{manufacturer.phoneNumber}</td>
                                    <td>{manufacturer.country}</td>

                                    <td><ManufacturerModal
                                        buttonLabel="Sửa"
                                        className="edit"
                                        title="Sửa"
                                        color="info"
                                        manufacturerId={manufacturer.manufacturerId}
                                        manufacturerName={manufacturer.manufacturerName}
                                        email={manufacturer.email}
                                        address={manufacturer.address}
                                        phoneNumber={manufacturer.phoneNumber}
                                        country={manufacturer.country}
                                        getResultInModal={this.getResultInModal}
                                        insertable={false}
                                        external={false}>
                                    </ManufacturerModal></td>
                                    <td>
                                        <Button color="danger"
                                            onClick={() => this.deleteManufacturer(manufacturer.manufacturerId)}>
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

export default ManufacturerManagement;