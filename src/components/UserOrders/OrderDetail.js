import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { formatter } from '../Formatter';
import { endpointUser, getWithAuth } from '../HttpUtils';
import RatingModal from '../RatingStar/RatingModal';

import './style.css';

class OrderDetail extends Component {
    state = { orderDetails: [], book: {} }

    componentDidMount() {
        this.fetchOrderDetail(this.props.match.params.orderid);
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

    render() {
        return (
            <div>
                <h3 className="order-title alert alert-secondary" align="center">Chi tiết đơn hàng</h3>
                <h5 className="order-id " >Mã đơn hàng: {this.props.match.params.orderid}</h5>
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Mã sách</th>
                            <th>Tên sách</th>
                            <th>Ảnh</th>
                            <th>Số lượng</th>
                            <th>Giảm giá</th>
                            <th>Đơn giá</th>
                            <th>Tổng cộng</th>
                            <td></td>
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
                                <td><RatingModal bookId={detail.bookId} /></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <hr />
                <p className="total-price"><strong>Thành tiền: {formatter.format(this.getTotalCheckoutPrice())}</strong></p>
            </div>
        );
    }
}

export default withRouter(OrderDetail);