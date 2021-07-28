import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { endpointUser, get, getWithAuth, postwithAuth, putWithAuth } from '../HttpUtils';
import { Button } from 'reactstrap'

class UserOrders extends Component {
    state = { orderList: [] }

    componentDidMount() {
        this.fetchUserOrders();
    }

    fetchUserOrders() {
        getWithAuth(endpointUser + "/list/orders/" + this.props.match.params.username).then((response) => {
            if (response.status === 200) {
                this.setState({ orderList: response.data })
                console.log("order data:" + response.data)
            }
        }).catch((error) => console.log("Fetching orders error: " + error))
    }

    onDetailOrderClick(id) {
        window.location.replace("http://localhost:3000/checkout/detail/" + id);
    }

    render() {
        return (
            <div>
                <h3>MY ORDERS</h3>
                <table>
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <th>Order Date</th>
                            <th>Order Address</th>
                            <th>Description</th>

                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.orderList.map((order) => (
                            <tr key={order.orderId}>
                                <td>{order.orderId}</td>
                                <td>{order.orderDate}</td>
                                <td>{order.orderAddress}</td>
                                <td>{order.description}</td>
                                <th><Button color="info" onClick={() => this.onDetailOrderClick(order.orderId)}>View Detail</Button></th>
                                <th></th>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default withRouter(UserOrders);