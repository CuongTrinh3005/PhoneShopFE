import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import { endpointAuth, get, post, postwithAuth } from '../../HttpUtils';

class LogOut extends Component {
    state = {}

    componentDidMount() {
        this.sendLogOutRequest();
    }

    sendLogOutRequest() {
        postwithAuth("http://localhost:9081/api/logout", null).then((response) => {
            if (response.status === 200) {
                alert("Log out successfully!");
                console.log("Log out successfully!")
                localStorage.removeItem("username");
                localStorage.removeItem("accessToken");
                localStorage.removeItem("role");
                window.location.replace("http://localhost:3000/account/signin");
            }
        }).catch(error => {
            console.log("error signup: " + error);
            alert("Maybe username or email is already existed! Please try again!");
        })
    }

    render() {
        return (
            <div>
                {/* {alert("Log out successfully!")} */}
                <Redirect to="/account/signin"></Redirect>
            </div>
        );
    }
}

export default LogOut;