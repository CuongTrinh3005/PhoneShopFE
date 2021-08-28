import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { endpointUser, getWithAuth, hostFrontend } from '../HttpUtils';
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
        window.location.replace(hostFrontend + "checkout/detail/" + id);
    }

    render() {
        return (
            <div>
                <h3 className="alert alert-success" align="center">ĐƠN HÀNG CỦA TÔI</h3>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>STT</th>
                            <th>Mã đơn hàng</th>
                            <th>Ngày đặt hàng</th>
                            <th>Địa chỉ giao</th>
                            <th>Mô tả</th>

                            <th></th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.orderList.map((order, index) => (
                            <tr key={order.orderId}>
                                <td>{index + 1}</td>
                                <td>{order.orderId}</td>
                                <td>{order.orderDate}</td>
                                <td>{order.orderAddress}</td>
                                <td>{order.description}</td>
                                <th><Button color="info" onClick={() => this.onDetailOrderClick(order.orderId)}>Xem chi tiết</Button></th>
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