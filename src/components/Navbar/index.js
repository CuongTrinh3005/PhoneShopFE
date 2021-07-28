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
                    <Link to={{ pathname: `/checkout/username/` + localStorage.getItem("username") }}><DropdownItem>My checkout</DropdownItem></Link>
                    <Link to="/admin/categories"><DropdownItem>Category Management</DropdownItem></Link>
                    <Link to="/admin/users"><DropdownItem>User Management</DropdownItem></Link>
                    <Link to="/admin/books"><DropdownItem>Book Management</DropdownItem></Link>
                </DropdownMenu>
            );
        }
        return (
            <DropdownMenu>
                <Link to="/account/logout"><DropdownItem>Log out</DropdownItem></Link>
                <DropdownItem>My checkout</DropdownItem>
            </DropdownMenu>
        );
    }

    render() {
        return (
            <div>
                <nav id='navbar'>
                    <ul>
                        <Link to="/"><li>Home</li></Link>
                        <Link to="/hello"><li>About</li></Link>

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
                            {/* <DropdownMenu>
                                <Link to="/account/signin"><DropdownItem>Sign In</DropdownItem></Link>
                                <Link to="/account/signup"><DropdownItem>Sign Up</DropdownItem></Link>

                                <Link to="/account/logout"><DropdownItem>Log out</DropdownItem></Link>
                                <DropdownItem>My checkout</DropdownItem>
                            </DropdownMenu> */}

                        </UncontrolledDropdown>
                    </ul>
                    <input type="text" placeholder="Search.." name="search" />

                    <div className="nav-details">
                        {localStorage.getItem("username") ? <p className="nav-username">
                            Hi, {localStorage.getItem("username")}</p> : ''}
                    </div>
                </nav>
            </div>
        );
    }
}

export default Navbar;