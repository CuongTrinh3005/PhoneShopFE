import axios from 'axios';
import React, { Component } from 'react';
import './Contact.css'
import { endpointUser, get } from '../HttpUtils';

class Contact extends Component {

    state = { userList: [], categoryList: [] }

    componentDidMount() {
        this.fetchUser();
    }

    fetchUser() {
        get(endpointUser + "/users").then((response) => {
            if (response.status === 200) {
                this.setState({ userList: response.data });
            }
        });
    }

    render() {
        return (<table id="table">
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Name</th>
                    <th>Email</th>
                </tr>
            </thead>
            <tbody>
                {this.state.userList.map((user) => (
                    <tr key={user.id}>
                        <td>{user.id}</td>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                    </tr>
                ))}
            </tbody>
        </table>);
    }
}

export default Contact;