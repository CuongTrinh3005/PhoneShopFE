import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { endpointPublic, get, hostFrontend } from '../../HttpUtils';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { messages } from '../../message';

toast.configure();
class ResetPassword extends Component {
    state = { username: "", email: "", errors: {} };

    handleSubmit(e) {
        e.preventDefault();
        if (this.validateForm(e.target.username.value) !== true)
            return;

        this.setState({ username: e.target.username.value })

        const credentials = { username: this.state.username };

        console.log("Reset info: " + JSON.stringify(credentials))

        get(endpointPublic + "/reset-password?username=" + this.state.username).then((response) => {
            if (response.status === 200) {
                toast.success(messages.resetPasswordSuccess, {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000,
                });
                setTimeout(function () {
                    window.location.replace(hostFrontend + "account/signin");
                }, 2000);
            }
        }).catch(error => {
            console.log("error reset password: " + error);
            toast.error(messages.resetPasswordFailed, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
            });
        })
    }

    validateForm(username) {
        let errors = {}, formIsValid = true;
        if (username.indexOf(' ') >= 0) {
            errors["username"] = messages.usernameContainsSpace;
            formIsValid = false;
        }
        else if (username.length < 3 || username.length > 40) {
            errors['username'] = messages.usernameLength;
            formIsValid = false;
        }

        this.setState({ errors: errors })

        return formIsValid;
    }

    render() {
        return (
            <div className="login-form">
                <h3>TẠO MẬT KHẨU MỚI</h3>
                <Form onSubmit={(e) => this.handleSubmit(e)}>
                    <FormGroup>
                        <Label for="username">Tên đăng nhập</Label>
                        <Input style={{ width: "20rem" }} type="text" name="username" required
                            id="username" placeholder="Nhập tên đăng nhập" onChange={e => this.setState({ username: e.target.value })} />
                        <span style={{ color: "red" }}>{this.state.errors["username"]}</span>
                    </FormGroup>
                    <Button color="info" style={{ marginTop: "1rem" }} type="submit">OK</Button>
                </Form>
            </div>
        );
    }
}

export default ResetPassword;