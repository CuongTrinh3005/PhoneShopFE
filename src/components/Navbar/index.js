import React, { Component } from 'react';
import { Link, Redirect } from 'react-router-dom';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Row, Col } from 'reactstrap'
import './navbar.css';
import { endpointPublic, get } from '../HttpUtils';
import { hostFrontend } from '../config';

class Navbar extends Component {
    state = { loginName: "" }


    renderWhenNoLogin() {
        return (
            <DropdownMenu>
                <Link to="/account/signin"><DropdownItem>Sign In</DropdownItem></Link>
                <Link to="/account/signup"><DropdownItem>Sign Up</DropdownItem></Link>
            </DropdownMenu>
        );
    }

    renderWhenLoggedIn() {
        if (localStorage.getItem("role") === "ROLE_ADMIN") {
            return (
                <DropdownMenu>
                    <Link to="/account/logout"><DropdownItem>Log out</DropdownItem></Link>
                    <Link to={{ pathname: `/checkout/username/` + localStorage.getItem("username") }}><DropdownItem>My orders</DropdownItem></Link>
                    <Link to="/admin/categories"><DropdownItem>Category Management</DropdownItem></Link>
                    <Link to="/admin/users"><DropdownItem>User Management</DropdownItem></Link>
                    <Link to="/admin/books"><DropdownItem>Book Management</DropdownItem></Link>
                    <Link to={{ pathname: `/account/change-password/` + localStorage.getItem("username") }}><DropdownItem>Change Password</DropdownItem></Link>
                    <Link to="/admin/orders"><DropdownItem>Order Management</DropdownItem></Link>
                    <Link to="/admin/authors"><DropdownItem>Author Management</DropdownItem></Link>
                    <Link to="/admin/publishers"><DropdownItem>Publisher Management</DropdownItem></Link>
                    <Link to="/admin/ratings"><DropdownItem>Rating Management</DropdownItem></Link>
                </DropdownMenu>
            );
        }
        return (
            <DropdownMenu>
                <Link to="/account/logout"><DropdownItem>Log out</DropdownItem></Link>
                <Link to={{ pathname: `/checkout/username/` + localStorage.getItem("username") }}><DropdownItem>My orders</DropdownItem></Link>
                <Link to={{ pathname: `/account/change-password/` + localStorage.getItem("username") }}><DropdownItem>Change Password</DropdownItem></Link>
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
                {/* <Row>

                    <header>
                        <Col>
                            <div style={{ width: "7rem" }, { height: "7rem" }}>
                                <a href="/"><img alt="logo" src={window.location.origin + '/logo.jpg'}
                                    className="col-sm-3" /></a>
                            </div>
                        </Col>

                        <Col>
                            <h1 className="alert alert-success col-sm-7" align="center" style={{ paddingLeft: "3rem" }}>Book Online Shopping</h1>
                        </Col>

                    </header>
                </Row> */}

                <nav id='navbar'>
                    <ul>
                        <Link to="/"><li>Home</li></Link>
                        <Link to="/about"><li>About</li></Link>

                        <UncontrolledDropdown color="#10cebe;"
                            style={{ display: 'inline-block', marginLeft: "2rem" }}>
                            <DropdownToggle caret>
                                Account
                            </DropdownToggle>
                            {localStorage.getItem("username") === null ? this.renderWhenNoLogin() : this.renderWhenLoggedIn()}
                        </UncontrolledDropdown>
                    </ul>

                    <input type="search" placeholder="Search.." maxLength="50"
                        name="search" style={{ width: "18rem" }}
                        onKeyDown={(event) => this.handleSearch(event)}
                    />

                    <Link to="/cart"><i className="fa fa-shopping-cart">CART</i></Link>

                    <div className="nav-details">
                        {localStorage.getItem("username") ? <Link to="/account/details"><p className="nav-username">
                            Hi, {localStorage.getItem("username")}</p></Link> : ''}
                    </div>
                </nav>
            </div>
        );
    }
}

export default Navbar;