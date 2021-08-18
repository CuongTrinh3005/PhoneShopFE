import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { endpointUser, getWithAuth, putWithAuth } from '../../components/HttpUtils';
import { Button, Form, FormGroup, Label, Input, Col, Row } from 'reactstrap';
import './style.css';

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

    formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'VND',
        minimumFractionDigits: 2
    })

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

        const orderBody = { orderAddress: this.state.order.orderAddress, description: this.state.order.description }
        console.log("Order Body:" + JSON.stringify(orderBody));
        putWithAuth(endpointUser + "/orders/" + this.state.order.orderId, orderBody).then((response) => {
            if (response.status === 200) {
                console.log("Update order successfully!");
                alert("Update order successfully!");
                window.location.replace("http://localhost:3000/admin/orders");
            }
        }).catch(error => {
            alert("Update order failed!" + error.response.data.message);
            console.log("error updating order: " + error);
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        })
    }

    setOrderAddress(event) {
        this.setState(prevState => {
            let order = Object.assign({}, prevState.order);  // creating copy of state variable jasper
            order.orderAddress = event.target.value;                     // update the name property, assign a new value                 
            return { order };                                 // return new object jasper object
        })
    }

    setOrderDescription(event) {
        this.setState(prevState => {
            let order = Object.assign({}, prevState.order);  // creating copy of state variable jasper
            order.description = event.target.value;                     // update the name property, assign a new value                 
            return { order };                                 // return new object jasper object
        })
    }

    validateForm() {
        let errors = {}, formIsValid = true;
        if (this.state.order.orderAddress !== '' && this.state.order.orderAddress.trim().length < 5) {
            errors["address"] = 'Address must be at least 5 characters!';
            formIsValid = false;
        }
        this.setState({ errors: errors });

        return formIsValid;
    }

    render() {
        return (
            <div>
                <h2 className="alert alert-secondary " align="center" style={{ marginTop: "2rem" }}>ORDER DETAIL</h2>
                <Form style={{ marginTop: "2.5rem" }} onSubmit={(e) => this.updateOrder(e)}>
                    <Row>
                        <Col sm="3">
                            <FormGroup>
                                <Label for="orderId">Order ID</Label>
                                <Input type="text" name="orderId" id="orderId" placeholder="ID" readOnly
                                    value={this.state.order.orderId} />
                            </FormGroup>
                        </Col>

                        <Col sm="3">
                            <FormGroup>
                                <Label for="customerId">Customer ID</Label>
                                <Input type="text" name="customerId" id="customerId" placeholder="Customer ID" readOnly
                                    value={this.state.order.customerId} />
                            </FormGroup>
                        </Col>

                        <Col sm="3">
                            <FormGroup>
                                <Label for="customerName">Customer Name</Label>
                                <Input type="text" name="customerName" id="customerName" placeholder="ID" readOnly
                                    value={this.state.order.customerFullName} />
                            </FormGroup>
                        </Col>

                        <Col sm="3">
                            <FormGroup>
                                <Label for="orderDate">Order Date</Label>
                                <Input type="text" name="orderDate" id="orderDate" placeholder="Order Date" readOnly
                                    value={this.state.order.orderDate} />
                            </FormGroup>
                        </Col>
                    </Row>

                    <FormGroup>
                        <Label for="orderAddress">Order Address</Label>
                        <Input type="text" name="orderAddress" id="orderAddress" placeholder="Order Address"
                            value={this.state.order.orderAddress} required
                            onChange={e => this.setOrderAddress(e)}
                        />
                        <span style={{ color: "red" }}>{this.state.errors["address"]}</span>
                    </FormGroup>

                    <FormGroup>
                        <Label for="description">Description</Label>
                        <Input type="text" name="description" id="description" placeholder="Description"
                            value={this.state.order.description} required
                            onChange={e => this.setOrderDescription(e)}
                        />
                    </FormGroup>

                    <hr />
                    <h6 className="alert alert-success " align="center">DETAIL ITEMS</h6>

                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Book Id</th>
                                <th>Book Name</th>
                                <th>Image</th>
                                <th>Quantity</th>
                                <th>Discount</th>
                                <th>Unit Price</th>
                                <th>Total In Unit</th>
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
                                    <td>{this.formatter.format(detail.unitPrice)}</td>
                                    <td>{this.formatter.format((1 - detail.discount) * detail.unitPrice * detail.orderQuantity)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <hr />
                    <p><strong>Total Price: {this.formatter.format(this.getTotalCheckoutPrice())}</strong></p>
                    <Button color="info" type="submit">Update</Button>
                </Form>

            </div>
        );
    }
}

export default withRouter(OrderDetailForAdmin);