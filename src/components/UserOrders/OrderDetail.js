import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { endpointUser, getWithAuth } from '../HttpUtils';

class OrderDetail extends Component {
    state = { orderDetails: [] }

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
                * this.state.orderDetails[index].unitPrice * this.state.orderDetails[index].quantityOrder;
            totalPrice += price;
        }
        return totalPrice;
    }

    render() {
        return (
            <div>
                <h3>Order Detail</h3>
                <h5>Order ID: {this.props.match.params.orderid}</h5>
                <table>
                    <thead>
                        <tr>
                            <th>Book Id</th>
                            <th>Quantity</th>
                            <th>Discount</th>
                            <th>Unit Price</th>
                            <th>Total In Unit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.orderDetails.map((detail) => (
                            <tr key={detail.orderDetailID}>
                                <td>{detail.orderDetailID.bookId}</td>
                                <td>{detail.quantityOrder}</td>
                                <td>{detail.discount * 100}%</td>
                                <td>{this.formatter.format(detail.unitPrice)}</td>
                                <td>{this.formatter.format((1 - detail.discount) * detail.unitPrice)}</td>
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