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
        postwithAuth(hostBackend + "/logout", null).then((response) => {
            if (response.status === 200) {
                toast.success(messages.logOutSuccess, {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 1000,
                });
            }
        }).catch(error => {
            toast.error("Maybe token expired, please login again!", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
            });
        })
        setTimeout(function () {
            window.location.replace(hostFrontend)
        }, 2000);

        localStorage.removeItem("username");
        localStorage.removeItem("userId");
        localStorage.removeItem("token");
        localStorage.removeItem("role");
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