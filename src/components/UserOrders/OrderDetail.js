import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { endpointUser, endpointPublic, getWithAuth, get } from '../HttpUtils';

class OrderDetail extends Component {
    state = { orderDetails: [], book: {} }

    componentDidMount() {
        this.fetchOrderDetail(this.props.match.params.orderid).then(() => {
            for (let detail of this.state.orderDetails)
                this.prepareForDisplayOrderDetail(detail.orderDetailID.bookId, detail.quantityOrder,
                    detail.unitPrice, detail.discount)
        });
    }

    async fetchOrderDetail(id) {
        await getWithAuth(endpointUser + "/order_details/" + id).then((response) => {
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

    prepareForDisplayOrderDetail(id, quantityInp, unitPriceInp, discountInp) {
        this.fetchBookById(id).then(() => {
            if (!this.handleCheck(this.state.book)) {
                this.setState(prevState => {
                    let book = Object.assign({}, prevState.book);  // creating copy of state variable jasper    
                    book.quantity = quantityInp;                     // update the name property, assign a new value                 
                    book.unitPrice = unitPriceInp;
                    book.discount = discountInp;

                    return { book };                                 // return new object jasper object
                })
                this.state.orderDetails.push(this.state.book);
            }
            else {
                this.setState(prevState => ({
                    orderDetails: prevState.orderDetails.map(
                        obj => (obj.orderDetailID.bookId === id ? Object.assign(obj,
                            { quantity: quantityInp }, { unitPrice: unitPriceInp }, { discount: discountInp })
                            : obj)
                    )
                }));
            }

            this.setState({ orderDetails: this.state.orderDetails })
        })
    }

    handleCheck(val) {
        return this.state.orderDetails.some(item => val.bookId === item.orderDetailID.bookId);
    }

    async fetchBookById(id) {
        await get(endpointPublic + "/books/" + id).then((response) => {
            if (response.status === 200) {
                this.setState({ book: response.data })
                // this.setState({ authorIds: response.data.authorIds })
            }
        }).catch((error) => console.log("Fetching book by id error: " + error))
    }

    getBookName(id) {
        get(endpointPublic + "/books/get-name/" + id).then((response) => {
            if (response.status === 200) {
                console.log("Book name: " + response.data)
                return response.data;
            }
        }).catch((error) => console.log("Fetching book by id error: " + error))
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
                            <th>Book Name</th>
                            <th>Quantity</th>
                            <th>Discount</th>
                            <th>Unit Price</th>
                            <th>Total In Unit</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.orderDetails.map((detail) => (
                            <tr key={detail.orderDetailID.bookId}>
                                <td>{detail.orderDetailID.bookId}</td>
                                <td>{detail.bookName}</td>
                                <td>{detail.quantityOrder}</td>
                                <td>{detail.discount * 100}%</td>
                                <td>{this.formatter.format(detail.unitPrice)}</td>
                                <td>{this.formatter.format((1 - detail.discount) * detail.unitPrice * detail.quantityOrder)}</td>
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