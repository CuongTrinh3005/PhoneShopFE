import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { endpointUser, getWithAuth } from '../HttpUtils';
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

    render() {
        return (
            <div>
                <h3 className="order-title">Order Detail</h3>
                <h5 className="order-id">Order ID: {this.props.match.params.orderid}</h5>
                <table>
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
            </div>
        );
    }
}

export default withRouter(OrderDetail);