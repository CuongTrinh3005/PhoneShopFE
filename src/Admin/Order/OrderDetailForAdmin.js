import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { endpointUser, getWithAuth, hostFrontend, putWithAuth } from '../../components/HttpUtils';
import { Button, Form, FormGroup, Label, Input, Col, Row } from 'reactstrap';
import './style.css';
import Select from 'react-select';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { messages } from '../../components/message';
import { formatter } from '../../components/Formatter';
import jsPDF from "jspdf";
import "jspdf-autotable";

toast.configure();
var options = [
    // { value: 'all', label: 'All' },
    {
        label: 'Specific status',
        options: [
            { value: 'CREATED', label: 'Created' },
            { value: 'COMPLETED', label: 'Completed' },
            { value: 'CANCELED', label: 'Canceled' },
        ],
    },
];
class OrderDetailForAdmin extends Component {
    state = { order: {}, orderDetails: [], errors: {} }

    componentDidMount() {
        this.fetchOrderById(this.props.match.params.id).then(() => this.fetchOrderDetail(this.state.order.orderId));
    }

    async fetchOrderById(id) {
        await getWithAuth(endpointUser + "/orders/" + id).then((response) => {
            if (response.status === 200) {
                this.setState({ order: response.data });
                console.log("order data:" + response.data);
            }
        }).catch((error) => console.log("Fetching orders error: " + error))
    }

    fetchOrderDetail(id) {
        getWithAuth(endpointUser + "/order_details/" + id).then((response) => {
            if (response.status === 200) {
                this.setState({ orderDetails: response.data })
                console.log("order data:" + response.data)
            }
        }).catch((error) => console.log("Fetching order details error: " + error))
    }

    getTotalCheckoutPrice() {
        let totalPrice = 0;
        for (let index = 0; index < this.state.orderDetails.length; index++) {
            const price = (1 - this.state.orderDetails[index].discount)
                * this.state.orderDetails[index].unitPrice * this.state.orderDetails[index].orderQuantity;
            totalPrice += price;
        }
        return totalPrice;
    }

    updateOrder(event) {
        event.preventDefault();
        if (!this.validateForm()) return;

        const orderBody = {
            orderAddress: this.state.order.orderAddress
            , description: this.state.order.description, status: this.state.order.status
        }
        console.log("Order Body:" + JSON.stringify(orderBody));
        putWithAuth(endpointUser + "/orders/" + this.state.order.orderId, orderBody).then((response) => {
            if (response.status === 200) {
                console.log("Update order successfully!");

                toast.success(messages.updateSuccess, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000,
                });

                setTimeout(function () {
                    window.location.replace(hostFrontend + "admin/orders");
                }, 2000);
            }
        }).catch(error => {
            toast.error(messages.updateFailed + error.response.data.message, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
            });
            console.log("error updating order: " + error);
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        })
    }

    setOrderAddress(event) {
        this.setState(prevState => {
            let order = Object.assign({}, prevState.order);
            order.orderAddress = event.target.value;
            return { order };
        })
    }

    setOrderDescription(event) {
        this.setState(prevState => {
            let order = Object.assign({}, prevState.order);
            order.description = event.target.value;
            return { order };
        })
    }

    setOrderStatus(choice) {
        this.setState(prevState => {
            let order = Object.assign({}, prevState.order);
            order.status = choice["value"];

            console.log("Status: " + JSON.stringify(choice["value"]));
            return { order };
        })
    }

    validateForm() {
        let errors = {}, formIsValid = true;
        if (this.state.order.orderAddress !== '' && this.state.order.orderAddress.trim().length < 5) {
            errors["address"] = messages.addressUserOrder;
            formIsValid = false;
        }
        this.setState({ errors: errors });

        return formIsValid;
    }

    convertUni2Ascii(str) {
        return str.normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd').replace(/Đ/g, 'D');
    }

    generatePdfFile() {
        const unit = "pt";
        const size = "A4"; // Use A1, A2, A3 or A4
        const orientation = "portrait"; // portrait or landscape

        const marginLeftLabel = 40;
        const marginLeftValue = 200;
        const doc = new jsPDF(orientation, unit, size);
        doc.setFont("Amiri");
        doc.setFontSize(15);

        const title = "Thong tin don hang";
        const orderIdLabel = "Ma don hang";
        const customerIdLabel = "Ma khach hang";
        const customerNameLabel = "Ho ten khach hang"
        const orderDateLabel = "Ngay dat"
        const addressLable = "Dia chi nhan"

        doc.text(title, marginLeftLabel, 40);
        doc.text(orderIdLabel, marginLeftLabel, 70);
        doc.text(customerIdLabel, marginLeftLabel, 90);
        doc.text(customerNameLabel, marginLeftLabel, 110);
        doc.text(orderDateLabel, marginLeftLabel, 130);
        doc.text(addressLable, marginLeftLabel, 150);

        doc.text(this.state.order.orderId.toString(), marginLeftValue, 70);
        doc.text(this.state.order.customerId, marginLeftValue, 90);
        doc.text(this.convertUni2Ascii(this.state.order.customerFullName), marginLeftValue, 110);
        doc.text(this.state.order.orderDate, marginLeftValue, 130);
        doc.text(this.convertUni2Ascii(this.state.order.orderAddress), marginLeftValue, 150);

        doc.text("DANH SACH SAN PHAM", marginLeftLabel, 190);
        // Export table
        const headers = [["Ma sach", "Ten sach", "Don gia(VND)", "Khuyen mai(%)", "SL", "Tong cong(VND)"]];
        const data = this.state.orderDetails.map(detail => [detail.bookId, this.convertUni2Ascii(detail.bookName), detail.unitPrice, detail.discount * 100, detail.orderQuantity, ((1 - detail.discount) * detail.unitPrice * detail.orderQuantity)]);

        let content = {
            startY: 220,
            head: headers,
            body: data
        };

        doc.autoTable(content);
        const fileName = this.state.order.orderId + "_" + this.state.order.customerId
            + "_" + this.state.order.orderDate + ".pdf";
        doc.save(fileName)
    }

    render() {
        return (
            <div>
                <h2 className="alert alert-secondary " align="center" style={{ marginTop: "2rem" }}>CHI TIẾT ĐƠN HÀNG</h2>
                <Form style={{ marginTop: "2.5rem" }} onSubmit={(e) => this.updateOrder(e)}>
                    <Row>
                        <Col sm="3">
                            <FormGroup>
                                <Label for="orderId">Mã đơn hàng</Label>
                                <Input type="text" name="orderId" id="orderId" placeholder="ID" readOnly
                                    value={this.state.order.orderId} />
                            </FormGroup>
                        </Col>

                        <Col sm="3">
                            <FormGroup>
                                <Label for="customerId">Mã khách hàng</Label>
                                <Input type="text" name="customerId" id="customerId" placeholder="Mã khách hàng" readOnly
                                    value={this.state.order.customerId} />
                            </FormGroup>
                        </Col>

                        <Col sm="3">
                            <FormGroup>
                                <Label for="orderDate">Ngày đặt</Label>
                                <Input type="text" name="orderDate" id="orderDate" placeholder="Ngày đặt" readOnly
                                    value={this.state.order.orderDate} />
                            </FormGroup>
                        </Col>

                        <Col sm="3">
                            <FormGroup>
                                <Label for="status">Trạng thái</Label>
                                <Select
                                    name="status-select"
                                    options={options}
                                    defaultValue={{ label: this.state.order.status, value: this.state.order.status }}
                                    isSearchable="true"
                                    value={{ label: this.state.order.status, value: this.state.order.status }}
                                    isClearable
                                    placeholder={this.state.order.status}
                                    onChange={choice => this.setOrderStatus(choice)}
                                />
                            </FormGroup>
                        </Col>
                    </Row>

                    <FormGroup>
                        <Label for="customerName">Tên khách hàng</Label>
                        <Input type="text" name="customerName" id="customerName" placeholder="ID" readOnly
                            value={this.state.order.customerFullName} />
                    </FormGroup>

                    <FormGroup>
                        <Label for="orderAddress">Địa chỉ giao</Label>
                        <Input type="text" name="orderAddress" id="orderAddress" placeholder="Địa chỉ giao"
                            value={this.state.order.orderAddress} required maxLength="100"
                            onChange={e => this.setOrderAddress(e)}
                        />
                        <span style={{ color: "red" }}>{this.state.errors["address"]}</span>
                    </FormGroup>

                    <FormGroup>
                        <Label for="description">Mô tả</Label>
                        <Input type="text" name="description" id="description" placeholder="Mô tả"
                            value={this.state.order.description} required
                            onChange={e => this.setOrderDescription(e)}
                        />
                    </FormGroup>

                    <hr />
                    <h6 className="alert alert-success " align="center">DANH MỤC SẢN PHẨM</h6>

                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Mã sách</th>
                                <th>Tên sách</th>
                                <th>Ảnh</th>
                                <th>Số lượng</th>
                                <th>Giảm giá</th>
                                <th>Đơn giả</th>
                                <th>Tổng</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.orderDetails.map((detail) => (
                                <tr key={detail.bookId}>
                                    <td>{detail.bookId}</td>
                                    <td>{detail.bookName}</td>
                                    <td>
                                        <img src={`data:image/jpeg;base64,${detail.photo}`}
                                            alt="Image loading..."
                                            width="150" height="100">
                                        </img>
                                    </td>
                                    <td>{detail.orderQuantity}</td>
                                    <td>{detail.discount * 100}%</td>
                                    <td>{formatter.format(detail.unitPrice)}</td>
                                    <td>{formatter.format((1 - detail.discount) * detail.unitPrice * detail.orderQuantity)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <hr />
                    <p><strong>Tổng cộng: {formatter.format(this.getTotalCheckoutPrice())}</strong></p>
                    <Button color="info" type="submit" style={{ float: "right" }}>CẬP NHẬT</Button>

                </Form>
                <Button color="warning" onClick={() => this.generatePdfFile()}
                    style={{ float: "right" }, { marginLeft: "25rem" }}>Xuất pdf file</Button>
            </div>
        );
    }
}

export default withRouter(OrderDetailForAdmin);