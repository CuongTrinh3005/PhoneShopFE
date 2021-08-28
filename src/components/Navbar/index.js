import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import './navbar.css';
import { hostFrontend } from '../HttpUtils';

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
                    <Link to={{ pathname: `/checkout/username/` + localStorage.getItem("username") }}><DropdownItem>Xem đơn hàng</DropdownItem></Link>
                    <Link to="/admin/categories"><DropdownItem>Quản lý thể loại</DropdownItem></Link>
                    <Link to="/admin/users"><DropdownItem>Quản lý người dùng</DropdownItem></Link>
                    <Link to="/admin/books"><DropdownItem>Quản lý sách</DropdownItem></Link>
                    <Link to={{ pathname: `/account/change-password/` + localStorage.getItem("username") }}><DropdownItem>Đổi mật khẩu</DropdownItem></Link>
                    <Link to="/admin/orders"><DropdownItem>Quản lý đơn hàng</DropdownItem></Link>
                    <Link to="/admin/authors"><DropdownItem>Quản lý tác giả</DropdownItem></Link>
                    <Link to="/admin/publishers"><DropdownItem>Quản lý NXB</DropdownItem></Link>
                    <Link to="/admin/ratings"><DropdownItem>Quản lý đánh giá</DropdownItem></Link>
                </DropdownMenu>
            );
        }
        return (
            <DropdownMenu>
                <Link to="/account/logout"><DropdownItem>Đăng xuất</DropdownItem></Link>
                <Link to={{ pathname: `/checkout/username/` + localStorage.getItem("username") }}><DropdownItem>Xem đơn hàng</DropdownItem></Link>
                <Link to={{ pathname: `/account/change-password/` + localStorage.getItem("username") }}><DropdownItem>Đổi mật khẩu</DropdownItem></Link>
            </DropdownMenu>
        );
    }

    handleSearch(event) {
        // event.preventDefault();
        if (event.key === 'Enter') {
            console.log("Search information: " + event.target.value);
            window.location.replace(hostFrontend + "books/search/" + event.target.value.trim());
        }
    }

    render() {
        return (
            <div>
                <nav id='navbar'>
                    <ul>
                        <Link to="/"><li>Trang chủ</li></Link>
                        <Link to="/about"><li>Thông tin</li></Link>

                        <UncontrolledDropdown color="#10cebe;"
                            style={{ display: 'inline-block', marginLeft: "2rem" }}>
                            <DropdownToggle caret>
                                Tài khoản
                            </DropdownToggle>
                            {localStorage.getItem("username") === null ? this.renderWhenNoLogin() : this.renderWhenLoggedIn()}
                        </UncontrolledDropdown>
                    </ul>

                    <input type="search" placeholder="Nhập tên sách cần tìm..." maxLength="50"
                        name="search" style={{ width: "18rem" }}
                        onKeyDown={(event) => this.handleSearch(event)}
                    />

                    <Link to="/cart"><i className="fa fa-shopping-cart">GIỎ HÀNG</i></Link>

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