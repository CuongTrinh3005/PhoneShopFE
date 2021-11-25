import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import './navbar.css';
import { hostFrontend } from '../HttpUtils';
import { FaShoppingCart } from "react-icons/fa";

class Navbar extends Component {
    state = { loginName: "" }

    renderWhenNoLogin() {
        return (
            <DropdownMenu>
                <Link to="/account/signin"><DropdownItem>Đăng nhập</DropdownItem></Link>
                <Link to="/account/signup"><DropdownItem>Đăng ký</DropdownItem></Link>
                <Link to="/account/reset-password"><DropdownItem>Quên mật khẩu</DropdownItem></Link>
            </DropdownMenu>
        );
    }

    renderWhenLoggedIn() {
        if (localStorage.getItem("role") === "ROLE_ADMIN") {
            return (
                <DropdownMenu>
                    <Link to="/account/logout"><DropdownItem>Đăng xuất</DropdownItem></Link>
                    <Link to={{ pathname: `/checkout/userId/` + localStorage.getItem("userId") }}><DropdownItem>Xem đơn hàng</DropdownItem></Link>
                    <Link to="/admin/categories"><DropdownItem>Quản lý loại sản phẩm</DropdownItem></Link>
                    <Link to="/admin/users"><DropdownItem>Quản lý người dùng</DropdownItem></Link>
                    <Link to="/admin/products"><DropdownItem>Quản lý sản phẩm</DropdownItem></Link>
                    <Link to={{ pathname: `/account/change-password/` + localStorage.getItem("username") }}><DropdownItem>Đổi mật khẩu</DropdownItem></Link>
                    <Link to="/admin/orders"><DropdownItem>Quản lý đơn hàng</DropdownItem></Link>
                    <Link to="/admin/brands"><DropdownItem>Quản lý thương hiệu</DropdownItem></Link>
                    <Link to="/admin/manufacturers"><DropdownItem>Quản lý Nhà SX</DropdownItem></Link>
                    <Link to="/admin/ratings"><DropdownItem>Quản lý đánh giá</DropdownItem></Link>
                    {/* <Link to="/personalization"><DropdownItem>Cá nhân hóa</DropdownItem></Link> */}
                </DropdownMenu>
            );
        }
        return (
            <DropdownMenu>
                <Link to="/account/logout"><DropdownItem>Đăng xuất</DropdownItem></Link>
                <Link to={{ pathname: `/checkout/userId/` + localStorage.getItem("userId") }}><DropdownItem>Xem đơn hàng</DropdownItem></Link>
                <Link to={{ pathname: `/account/change-password/` + localStorage.getItem("username") }}><DropdownItem>Đổi mật khẩu</DropdownItem></Link>
                {/* <Link to="/personalization"><DropdownItem>Cá nhân hóa</DropdownItem></Link> */}
            </DropdownMenu>
        );
    }

    handleSearch(event) {
        // event.preventDefault();
        if (event.key === 'Enter') {
            console.log("Search information: " + event.target.value);
            this.setState({ searchValue: event.target.value.trim() })
            window.location.replace(hostFrontend + "products/search/" + event.target.value.trim());
        }
    }

    render() {
        return (
            <div>
                <nav id='navbar'>
                    <ul>
                        <Link to="/"><li>Trang chủ</li></Link>
                        <Link to="/about"><li>Thông tin CH</li></Link>

                        <UncontrolledDropdown color="#10cebe;"
                            style={{ display: 'inline-block', marginLeft: "2rem" }}>
                            <DropdownToggle caret>
                                Tài khoản
                            </DropdownToggle>
                            {localStorage.getItem("username") === null ? this.renderWhenNoLogin() : this.renderWhenLoggedIn()}
                        </UncontrolledDropdown>
                    </ul>

                    <input type="search" placeholder="Nhập tên sản phẩm cần tìm..." maxLength="50"
                        name="search" style={{ width: "18rem" }}
                        onKeyDown={(event) => this.handleSearch(event)}
                    />

                    <Link to="/cart"><FaShoppingCart color="white" />
                        <b className="cart-title">GIỎ HÀNG</b>
                    </Link>

                    <div className="nav-details">
                        {localStorage.getItem("username") ? <Link to="/account/details"><p className="nav-username">
                            Xin chào, {localStorage.getItem("username")}</p></Link> : ''}
                    </div>
                </nav>
            </div>
        );
    }
}

export default Navbar;