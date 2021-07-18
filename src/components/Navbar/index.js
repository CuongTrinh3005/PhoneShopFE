import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem, Button, ButtonDropdown } from 'reactstrap'
import './navbar.css';
import { endpointPublic, get } from '../HttpUtils';

class Navbar extends Component {
    state = { categoryList: [] }

    componentDidMount() {
        this.fetchCategories();
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

    render() {
        return (
            <div>
                <nav id='navbar'>
                    <ul>
                        <Link to="/"><li>Home</li></Link>
                        <Link to="/hello"><li>HelloWord</li></Link>
                        <Link to="/contact"><li>Contact</li></Link>
                        <Link to="/about"><li>About</li></Link>

                        <UncontrolledDropdown color="#10cebe;"
                            style={{ display: 'inline-block', margin: "auto" }}>
                            <DropdownToggle caret>
                                Categories
                            </DropdownToggle>
                            <DropdownMenu>
                                {this.state.categoryList.map((cate) => (
                                    <div key={cate.categoryId}>
                                        <DropdownItem onClick={() => this.getBookByCategoty(cate.categoryName)}>
                                            {cate.categoryName}
                                        </DropdownItem>
                                    </div>
                                ))}
                            </DropdownMenu>
                        </UncontrolledDropdown>
                    </ul>
                    <input type="text" placeholder="Search.." name="search" />

                    <div className="nav-details">
                        <p className="nav-username"> {this.props.name} </p>
                    </div>
                </nav>
            </div>
        );
    }
}

export default Navbar;