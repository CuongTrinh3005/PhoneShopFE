import React, { Component } from 'react';
import { deleteWithAuth, endpointAdmin, endpointPublic, endpointUser, getWithAuth } from '../../components/HttpUtils';
import { Button, Container, Row, Col } from 'reactstrap';
import BrandModal from './BrandModal';
import './style.css'
import { messages } from '../../components/message';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();
class BrandManagement extends Component {
    state = { brandList: [], resultInModal: false }

    getResultInModal = (resultModal) => {
        this.setState({ result: resultModal })
    }

    fetchBrands() {
        getWithAuth(endpointPublic + "/brands").then((response) => {
            if (response.status === 200) {
                this.setState({ brandList: response.data })
            }
        }).catch((error) => console.log("Fetching authors error: " + error))
    }

    componentDidMount() {
        this.fetchBrands();
    }

    deleteBrand(id) {
        if (window.confirm(messages.deleteConfirm)) {
            deleteWithAuth(endpointAdmin + "/brands/" + id).then((response) => {
                if (response.status === 200) {
                    toast.success(messages.deleteSuccess, {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 1000,
                    });
                    this.fetchBrands();
                }
            }).catch(error => {
                if (error.response) {
                    toast.error(messages.deleteFailed + "Không được xóa thương hiệu đã có sản phẩm!", {
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
                    <h3 className="alert alert-warning" align="center">QUẢN LÝ THƯƠNG HIỆU</h3>
                    <Col sm="9"></Col>

                    <Col >
                        <BrandModal
                            buttonLabel="Thêm mới thương hiệu"
                            className="insert-button"
                            title="Thêm mới thương hiệu"
                            color="success"
                            brandId=""
                            brandName=""
                            country=""
                            description=""
                            getResultInModal={this.getResultInModal}
                            insertable={true}
                            external={false}>
                            Thêm mới thương hiệu</BrandModal>
                    </Col>
                </Row>

                <Row>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên thương hiệu</th>
                                <th>Quốc gia</th>
                                <th>Mô tả</th>

                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.brandList.map((brand) => (
                                <tr key={brand.brandId}>
                                    <td>{brand.brandId}</td>
                                    <td>{brand.brandName}</td>
                                    <td>{brand.country}</td>
                                    <td>{brand.description}</td>

                                    <td><BrandModal
                                        buttonLabel="Sửa"
                                        className="edit"
                                        title="Sửa"
                                        color="info"
                                        brandId={brand.brandId}
                                        brandName={brand.brandName}
                                        country={brand.country}
                                        description={brand.description}
                                        getResultInModal={this.getResultInModal}
                                        insertable={false}
                                        external={false}>
                                    </BrandModal></td>
                                    <td>
                                        <Button color="danger"
                                            onClick={() => this.deleteBrand(brand.brandId)}>
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

export default BrandManagement;