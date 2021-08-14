import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap'
import './navbar.css';
import { endpointPublic, get } from '../HttpUtils';

class Navbar extends Component {
    state = { categoryList: [], loginName: "" }

    componentDidMount() {
        this.fetchCategories();
        this.setState({ loginName: localStorage.getItem("username") })
    }

    fetchCategories() {
        get(endpointPublic + "/categories").then((response) => {
            if (response.status === 200) {
                this.setState({ categoryList: response.data })
            }
        })
    }

    getBookByCategoty(categoryName) {
        this.props.getCategoryName(categoryName)
    }

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

    render() {
        return (
            <div>
                <nav id='navbar'>
                    <ul>
                        <Link to="/"><li>Home</li></Link>
                        <Link to="/about"><li>About</li></Link>

                        <UncontrolledDropdown color="#10cebe;"
                            style={{ display: 'inline-block', marginLeft: "2rem" }}>
                            <DropdownToggle caret>
                                Categories
                            </DropdownToggle>
                            <DropdownMenu>
                                {this.state.categoryList.map((cate) => (
                                    <div key={cate.categoryId}>
                                        <Link to={{ pathname: `/books/category=` + cate.categoryName }}>
                                            <DropdownItem onClick={() => this.getBookByCategoty(cate.categoryName)}>
                                                {cate.categoryName}
                                            </DropdownItem>
                                        </Link>
                                    </div>
                                ))}
                            </DropdownMenu>
                        </UncontrolledDropdown>

                        <UncontrolledDropdown color="#10cebe;"
                            style={{ display: 'inline-block', marginLeft: "2rem" }}>
                            <DropdownToggle caret>
                                Account
                            </DropdownToggle>
                            {localStorage.getItem("username") === null ? this.renderWhenNoLogin() : this.renderWhenLoggedIn()}
                        </UncontrolledDropdown>
                    </ul>
                    <input type="text" placeholder="Search.." name="search" />

                    <Link to="/cart"><i class="fa fa-shopping-cart">CART</i></Link>

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