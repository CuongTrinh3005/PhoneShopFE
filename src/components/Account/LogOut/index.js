import React, { Component } from 'react';
import { Redirect } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { hostBackend, hostFrontend, postwithAuth } from '../../HttpUtils';
import { messages } from '../../message';

toast.configure();
class LogOut extends Component {
    state = {}

    componentDidMount() {
        this.sendLogOutRequest();
    }

    sendLogOutRequest() {
        postwithAuth(hostBackend + "api/logout", null).then((response) => {
            if (response.status === 200) {
                toast.success(messages.logOutSuccess, {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 1000,
                });
                localStorage.removeItem("username");
                localStorage.removeItem("accessToken");
                localStorage.removeItem("role");
                setTimeout(function () {
                    window.location.replace(hostFrontend)
                }, 2000);
            }
        }).catch(error => {
            toast.error("Maybe token expired, login failed!", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
            });
        })
    }

    render() {
        return (
            <div>
                <Redirect to="/account/signin"></Redirect>
            </div>
        );
    }
}

export default LogOut;