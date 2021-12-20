import React, { Component } from 'react';
import { getCookie, setCookie, deleteCookie } from '../CookieUtils';
import { endpointPublic, get, getWithAuth, endpointUser, postwithAuth, hostFrontend } from '../HttpUtils';
import { Input, Button, Form, FormGroup, Label } from 'reactstrap';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './style.css';
import { messages } from '../message';
import { formatter } from '../Formatter';

toast.configure();
class Checkout extends Component {
    state = {
        cart: [], product: {}, user: {}, shippingAddress: "", description: "", errors: {}
        , paymentList: {}, paymentId: 1
    }
    componentDidMount() {
        this.fetchCart();
        this.fetchUserInfo(localStorage.getItem("username"));
        this.fetchAllPayments();
    }

    async fetchProductById(id) {
        await get(endpointPublic + "/products/" + id).then((response) => {
            if (response.status === 200) {
                this.setState({ product: response.data });
            }
        }).catch((error) => console.log("Fetching product by id error: " + error))
    }

    prePareForCart(id, quantityInp) {
        this.fetchProductById(id).then(() => {
            if (this.handleCheck(this.state.product) !== true) {
                this.setState(prevState => {
                    let product = Object.assign({}, prevState.product);  // creating copy of state variable jasper
                    product.quantity = quantityInp;                     // update the name property, assign a new value                 
                    return { product };                                 // return new object jasper object
                })
                this.state.cart.push(this.state.product);
            }
            else {
                this.setState(prevState => ({
                    cart: prevState.cart.map(
                        obj => (obj.productId === id ? Object.assign(obj, { quantity: obj.quantity + quantityInp }) : obj)
                    )
                }));
            }
            this.setState({ cart: this.state.cart })
        })

    }

    handleCheck(val) {
        return this.state.cart.some(item => val.productId === item.productId);
    }

    checkCookieExist() {
        var cookieStr = getCookie("cart");
        if (cookieStr === null || cookieStr === '') {
            return false;
        }
        return true;
    }

    fetchCart = () => {
        let cartString = getCookie("cart");
        if (cartString !== null || cartString !== '') {
            let arrProd = cartString.split("|");

            for (let i = 0; i < arrProd.length - 1; i++) {
                let prodDetail = arrProd[i].split("-");
                let id = prodDetail[0];
                let quantity = prodDetail[1];
                console.log("id: " + id + ", quantity: " + quantity);

                this.prePareForCart(id, quantity);
            }
        }
    }

    getQuantityOfproduct(id) {
        let quantity;
        this.state.cart.map(
            obj => (obj.productId === id ? quantity = obj.quantity : quantity = -1));

        return quantity;
    }

    remove_product_on_list = (id) => {
        if (window.confirm(messages.deleteConfirm)) {
            let quantity = this.state.cart.find(x => x.productId === id).quantity;

            this.setState({
                cart: this.state.cart.filter(item => item.productId !== id)
            })

            const itemStrDelete = id + "-" + quantity + "|";
            console.log("Cookie to remove: " + itemStrDelete);
            // remove this item in cookie
            let cartString = getCookie("cart").replace(itemStrDelete, '');
            console.log("Cookie after remove: " + cartString);
            setCookie("cart", cartString, 1);
        }
    }

    getTotalCartPrice() {
        let totalPrice = 0;
        for (let index = 0; index < this.state.cart.length; index++) {
            const price = (1 - this.state.cart[index].discount)
                * this.state.cart[index].unitPrice * this.state.cart[index].quantity;
            totalPrice += price;
        }
        return totalPrice;
    }

    fetchUserInfo(username) {
        getWithAuth(endpointUser + "/users?username=" + username).then((response) => {
            if (response.status === 200) {
                this.setState({ user: response.data })
                this.setState({ shippingAddress: response.data.address })
            }
        }).catch((error) => console.log("Fetching user error: " + error))
    }

    fetchAllPayments() {
        getWithAuth(endpointPublic + "/payments").then((response) => {
            if (response.status === 200) {
                this.setState({ paymentList: response.data });
            }
        }).catch((error) => console.log("Fetching user error: " + error))
    }

    prepareOrderDetailID(productId) {
        const orderDetailId = { "productId": productId }
        return orderDetailId;
    }

    prepareOrderDetail(product) {
        const orderDetail = {
            "orderDetailID": this.prepareOrderDetailID(product.productId),
            "quantityOrder": product.quantity,
            "discount": product.discount,
            "unitPrice": product.unitPrice
        }

        return orderDetail;
    }

    validateForm() {
        let errors = {}, formIsValid = true;
        if (!this.state.shippingAddress && this.state.shippingAddress === '') {
            errors["shippingAddress"] = "Vui lòng không để trống thông tin địa chỉ giao hàng";
            formIsValid = false;
        }
        else if (this.state.shippingAddress.trim().length < 5) {
            errors["shippingAddress"] = messages.addressUserOrder;
            formIsValid = false;
        }
        // else if(this.state.paymentId === -1 || this.state.paymentId===null){
        //     this.setState({paymentId:1});
        // }
        this.setState({ errors: errors })

        return formIsValid;
    }

    onCheckoutConfirm(e) {
        e.preventDefault();
        if (!this.validateForm())
            return;

        console.log("Shipping address: " + e.target.orderAddress.value);
        console.log("Description: " + e.target.description.value);

        let detailArr = [];
        for (let index = 0; index < this.state.cart.length; index++) {
            detailArr.push(this.prepareOrderDetail(this.state.cart[index]))
        }

        const orderBody = {
            "orderAddress": e.target.orderAddress.value.trim(),
            "description": e.target.description.value.trim(),
            "orderDetails": detailArr
        }

        console.log("order Body:  " + JSON.stringify(orderBody))

        postwithAuth(endpointUser + "/orders?username=" + this.state.user.username + "&paymentId="
            + this.state.paymentId, orderBody).then((response) => {
                if (response.status === 200 || response.status === 201) {
                    console.log("Ordering successfully!");

                    toast.success(messages.orderSuccess, {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 2000,
                    });
                    deleteCookie("cart", "/", "localhost");
                    setTimeout(function () {
                        window.location.replace(hostFrontend + "checkout/userId/" + localStorage.getItem("userId"));
                    }, 2000);
                }
            }).catch(error => {
                toast.error(messages.orderFailed + error.response.data.message, {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000,
                });
                console.log("error order product: " + error);
                console.log(error.response.data);
                console.log(error.response.status);
                console.log(error.response.headers);
            })
    }

    renderCheckoutList() {
        return (
            <div>
                <Form onSubmit={(e) => this.onCheckoutConfirm(e)}>
                    <FormGroup>
                        <Label for="username">Tên đăng nhập</Label>
                        <Input style={{ width: "20rem" }} type="text" name="username" readOnly="true"
                            id="username" value={this.state.user.username} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="fullname">Họ tên</Label>
                        <Input style={{ width: "20rem" }} type="fullname" name="fullname" readOnly="true"
                            id="fullname" value={this.state.user.fullName} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="orderAddress">Địa chỉ giao</Label>
                        <Input style={{ width: "20rem" }} type="orderAddress" name="orderAddress" id="orderAddress"
                            placeholder="Địa chỉ giao" value={this.state.shippingAddress} required
                            onChange={e => this.setState({ shippingAddress: e.target.value })} />
                        <span style={{ color: "red" }}>{this.state.errors["shippingAddress"]}</span>
                    </FormGroup>
                    <FormGroup>
                        <Label for="description">Mô tả</Label>
                        <Input style={{ width: "20rem" }} type="description" name="description"
                            id="description" placeholder="Mô tả"
                            onChange={e => this.setState({ description: e.target.value })} />
                    </FormGroup>
                    {/* <FormGroup>
                        <Label for="payment">Hình thức thanh toán</Label>
                        <Input style={{ width: "20rem" }} type="select" name="payment" id="paymentSelect"
                        >
                            {this.state.paymentList.map((payment) => (
                                <option key={payment.paymentId}
                                    selected={payment.paymentId === 1}
                                >{payment.paymentType}</option>
                            ))}
                        </Input>
                        <span style={{ color: "red" }}>{this.state.errors["payment"]}</span>
                    </FormGroup> */}

                    <h3 className="title-order">THÔNG TIN ĐƠN HÀNG</h3>
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                {/* <th>product ID</th> */}
                                <th>Tên sản phẩm</th>
                                <th>Ảnh</th>
                                <th>Số lượng</th>
                                <th>Đơn giá</th>
                                <th>Giảm giá</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.cart.map((product) => (
                                <tr key={product.id}>
                                    {/* <td>{product.productId}</td> */}
                                    <td>{product.productName}</td>
                                    <td><img width="150" height="100" src={`data:image/jpeg;base64,${product.image}`} alt="Loading..."></img></td>
                                    <td>{product.quantity}</td>
                                    <td>{formatter.format(product.unitPrice)}</td>
                                    <td>{product.discount * 100}%</td>
                                    <td>{formatter.format((1 - product.discount) * product.quantity * product.unitPrice)}</td>
                                    <td><Button color="danger" onClick={() => this.remove_product_on_list(product.productId)}>Xóa</Button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <hr />
                    <h6 className="total-price">Tổng cộng: {formatter.format(this.getTotalCartPrice())}</h6>

                    <Button color="info" variant="contained" style={{ float: 'right' }, { marginTop: "2rem" }}>XÁC NHẬN ĐẶT HÀNG</Button>
                </Form>
                <br />
                <br />
                <br />
            </div>
        );
    }

    renderEmptyCheckoutList() {
        return (
            <div>
                <h6 align="center">Bạn không có sản phẩm để thực hiện mua</h6>
            </div>
        );
    }

    render() {
        return (
            <div >
                <h1 className="cart-list alert alert-warning" align="center">XÁC NHẬN THÔNG TIN ĐẶT HÀNG</h1>
                {this.state.cart.length > 0 ? this.renderCheckoutList() : this.renderEmptyCheckoutList()}
            </div>
        );
    }
}

export default Checkout;