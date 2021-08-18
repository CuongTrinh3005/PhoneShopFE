import React, { Component } from 'react';
import { endpointUser, getWithAuth } from '../../components/HttpUtils';
import { Button } from 'reactstrap';
import './style.css';

class OrderManagement extends Component {
    state = { orderList: [] }

    componentDidMount() {
        this.fetchOrdersInDateDescending();
    }

    fetchOrdersInDateDescending() {
        getWithAuth(endpointUser + "/orders/date-descending").then((response) => {
            if (response.status === 200) {
                this.setState({ orderList: response.data })
                console.log("order data:" + response.data)
            }
        }).catch((error) => console.log("Fetching orders error: " + error))
    }

    onDetailOrderClick(id) {
        window.location.replace("http://localhost:3000/admin/order-detail/" + id);
    }

    render() {
        return (
            <div>
                <h2 className="alert alert-success " align="center" style={{ marginTop: "2rem" }}>Order Management</h2>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>No.</th>
                            <th>ID</th>
                            <th>Customer ID</th>
                            <th>Customer Name</th>
                            <th>Date</th>
                            <th>Address</th>
                            <th>Description</th>

                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.orderList.map((order, index) => (
                            <tr key={index}>
                                <th>{index + 1}</th>
                                <td>{order.orderId}</td>
                                <td>{order.customerId}</td>
                                <th>{order.customerFullName}</th>
                                <td>{order.orderDate}</td>
                                <td>{order.orderAddress}</td>
                                <td>{order.description}</td>

                                <th><Button color="info" onClick={() => this.onDetailOrderClick(order.orderId)}>Detail</Button></th>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default OrderManagement;