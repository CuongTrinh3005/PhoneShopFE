import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import './SignIn.css'
import { endpointAuth, hostFrontend, post } from '../../HttpUtils';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { messages } from '../../message';

toast.configure();
class Login extends Component {
    state = { username: "", password: "", roles: [], accessToken: "", tokenType: "", errors: {} };

    handleSubmit(e) {
        e.preventDefault();
        if (this.validateForm(e.target.username.value, e.target.password.value) !== true)
            return;

        this.setState({ username: e.target.username.value })
        this.setState({ password: e.target.password.value })

        const credentials = { username: this.state.username, password: this.state.password };

        post(endpointAuth + "/signin", credentials).then((response) => {
            if (response.status === 200) {
                this.setState({ username: response.data.username })
                this.setState({ roles: response.data.roles })
                this.setState({ accessToken: response.data.accessToken })
                this.setState({ tokenType: response.data.tokenType })
                this.saveLogInInfo();

                toast.success(`Xin chào, ${response.data.username}`, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000,
                });
                this.props.getLoginName(response.data.username);
                setTimeout(function () {
                    window.location.replace(hostFrontend)
                }, 2000);
            }
        }).catch(error => {
            console.log("error sigin: " + error);
            toast.error(messages["loginFailed"], {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
            });
        })
    }

    saveLogInInfo() {
        localStorage.setItem("username", this.state.username);
        localStorage.setItem("accessToken", this.state.accessToken);
        // localStorage.setItem("tokenType", this.state.tokenType);
        localStorage.setItem("role", this.state.roles.join(", "));
    }

    validateForm(username, password) {
        let errors = {}, formIsValid = true;

        if (username.length < 3 || username.length > 40) {
            errors['username'] = messages.usernameLength;
            formIsValid = false;
        }
        else if (password.length < 4 || password.length > 40) {
            errors['password'] = messages.passwordLength;
            formIsValid = false;
        }
        this.setState({ errors: errors })

        return formIsValid;
    }

    render() {
        return (
            <div className="login-form">
                <h3>TRANG ĐĂNG NHẬP</h3>
                <Form onSubmit={(e) => this.handleSubmit(e)}>
                    <FormGroup>
                        <Label for="username">Tên đăng nhập </Label>
                        <Input style={{ width: "20rem" }} type="text" name="username" required
                            id="username" placeholder="Nhập tên đăng nhập" onChange={e => this.setState({ username: e.target.value })} />
                        <span style={{ color: "red" }}>{this.state.errors["username"]}</span>
                    </FormGroup>
                    <FormGroup>
                        <Label for="password">Mật khẩu</Label>
                        <Input style={{ width: "20rem" }} type="password" name="password" required
                            id="password" placeholder="Nhập mật khẩu" onChange={e => this.setState({ password: e.target.value })} />
                        <span style={{ color: "red" }}>{this.state.errors["password"]}</span>
                    </FormGroup>
                    <Button color="info" style={{ marginTop: "1rem" }} type="submit">Đăng nhập</Button>
                    <Link to="/account/reset-password"><p>Quên mật khẩu ?</p></Link>
                </Form>
            </div>
        );
    }
}

export default Login;