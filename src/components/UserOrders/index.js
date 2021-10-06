import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { endpointUser, getWithAuth, hostFrontend } from '../HttpUtils';
import { formatDate } from '../Helper';

class UserOrders extends Component {
    state = { orderList: [] }

    componentDidMount() {
        this.fetchUserOrders();
    }

    fetchUserOrders() {
        getWithAuth(endpointUser + "/orders/list/" + this.props.match.params.userId).then((response) => {
            if (response.status === 200) {
                this.setState({ orderList: response.data })
                console.log("order data:" + response.data)
            }
        }).catch((error) => console.log("Fetching orders error: " + error))
    }

    onDetailOrderClick(id) {
        window.location.replace(hostFrontend + "checkout/detail/" + id);
    }

    renderWhenNoOrders() {
        return (
            <h3 align="center">Bạn chưa có đơn hàng!</h3>
        );
    }

    renderWhenHasOrders() {
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
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.orderList.map((order, index) => (
                            <tr onClick={() => this.onDetailOrderClick(order.orderId)} key={order.orderId}>
                                <td>{index + 1}</td>
                                <td>{order.orderId}</td>
                                <td>{formatDate(order.createdDate)}</td>
                                <td>{order.orderAddress}</td>
                                <td>{order.description}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }

    render() {
        return (
            <div>
                {this.state.orderList.length === 0 ? this.renderWhenNoOrders() : this.renderWhenHasOrders()}
            </div>
        );
    }
}

export default withRouter(UserOrders);