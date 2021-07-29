import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';

import { postwithAuth } from '../../HttpUtils';

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
                window.location.replace("http://localhost:3000");
            }
        }).catch(error => {
            console.log("error signup: " + error);
            alert("Maybe token expired");
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