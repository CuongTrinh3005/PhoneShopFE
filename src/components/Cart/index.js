import React, { Component } from 'react';
import { endpointPublic, get, hostFrontend } from '../HttpUtils';
import { getCookie, setCookie, deleteCookie } from '../CookieUtils';
import { Input, Button } from 'reactstrap';
import './style.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { messages } from '../message';
import { formatter } from '../Formatter';

toast.configure();
// var list;
class CartItem extends Component {
    state = { cart: [], product: {} }

    componentDidMount() {
        const username = localStorage.getItem('username');
        if (username === null || username === undefined || username === '') {
            toast.warning(messages.loginToProceed, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
            });
            return;
        }
        this.fetchCart();
    }

    async fetchProductById(id) {
        await get(endpointPublic + "/products/" + id).then((response) => {
            if (response.status === 200) {
                this.setState({ product: response.data })
            }
        }).catch((error) => console.log("Fetching product by id error: " + error))
    }

    prePareForCart(id, quantityInp) {
        this.fetchProductById(id).then(() => {
            if (this.handleCheck(this.state.product) !== true) {
                this.setState(prevState => {
                    let product = Object.assign({}, prevState.product);
                    product.quantity = quantityInp;
                    return { product };
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

    onQuantityChange(id, e) {
        this.setState(prevState => ({
            cart: prevState.cart.map(
                obj => (obj.productId === id ? Object.assign(obj, { quantity: e.target.value }) : obj)
            )
        }));
    }

    onCheckoutClick() {
        if (localStorage.getItem('username') == null || localStorage.getItem('username') === undefined
            || localStorage.getItem('username' === '')) {
            toast.warning(messages.loginToProceed, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
            });
            return;
        }

        // Check cart value has change or not
        let cartString = "";
        for (let index = 0; index < this.state.cart.length; index++) {
            cartString += this.state.cart[index].productId + "-" + this.state.cart[index].quantity + "|";
        }
        if (cartString !== getCookie("cart")) {
            setCookie("cart", cartString, 1);
        }

        window.location.replace(hostFrontend + "cart/checkout")
    }

    onClearCart() {
        if (window.confirm(messages.deleteConfirm)) {
            this.setState({ cart: [] });
            deleteCookie("cart", "/", "localhost");
        }
    }

    renderShoppingCart() {
        return (
            <div >
                <table className="table table-hover">
                    <thead>
                        <tr>
                            <th>Tên sách</th>
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
                                <td>{product.productName}</td>
                                <td><img width="150" height="100" src={`data:image/jpeg;base64,${product.image}`} alt="Loading..."></img></td>
                                <td><Input value={product.quantity} onChange={(e) => this.onQuantityChange(product.productId, e)}
                                    type="number" min="1" style={{ width: "5rem" }} /> </td>
                                <td>{formatter.format((product.unitPrice))}</td>
                                <td>{product.discount * 100}%</td>
                                <td>{formatter.format((1 - product.discount) * product.quantity * product.unitPrice)}</td>
                                <td><Button color="danger" onClick={() => this.remove_product_on_list(product.productId)}>Xóa</Button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <hr />
                <h6 className="total-price">Tổng cộng: {formatter.format(this.getTotalCartPrice())}</h6>

                <div className="cart-actions">
                    <Button color="info" variant="contained" onClick={() => this.onCheckoutClick()}>Đặt hàng</Button>
                    <Button color="danger" variant="contained" onClick={() => this.onClearCart()}>Xóa giỏ hàng</Button>
                </div>

                <br />
                <br />
                <br />
            </div>
        );
    }

    renderEmptyCart() {
        return (
            <div>
                <h6 align="center">Bạn không có sản phẩm trong giỏ hàng</h6>
            </div>
        )
    }

    render() {
        return (
            <div >
                <h1 className="cart-list alert alert-info" align="center">GIỎ HÀNG</h1>
                {this.state.cart.length > 0 ? this.renderShoppingCart() : this.renderEmptyCart()}

            </div>
        );
    }
}

export default CartItem;