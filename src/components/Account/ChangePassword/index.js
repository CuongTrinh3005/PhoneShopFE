import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { endpointUser, hostFrontend, postwithAuth } from '../../HttpUtils';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { messages } from '../../message';

toast.configure();
class ChangePassword extends Component {
    state = { username: this.props.match.params.username, password: "", newPassword: "", confirmPassword: "", errors: {} }

    handleSubmit(e) {
        e.preventDefault();
        if (!this.validateForm(e.target.password.value,
            e.target.newPassword.value, e.target.confirmPassword.value))
            return;

        this.setState({ password: e.target.password.value })
        this.setState({ newPassword: e.target.newPassword.value })
        this.setState({ confirmPassword: e.target.confirmPassword.value })

        const personalInfo = {
            username: this.state.username,
            currentPassword: this.state.password,
            newPassword: this.state.newPassword,
            // confirmPassword: this.state.confirmPassword
        };

        console.log("Personal info: " + JSON.stringify(personalInfo));

        postwithAuth(endpointUser + "/users/change-password", personalInfo).then((response) => {
            if (response.status === 200 || response.status === 201) {
                this.setState({ message: "Change password successfully!" })

                toast.success(messages.changePasswordSuccess, {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000,
                });
                setTimeout(function () {
                    window.location.replace(hostFrontend + "account/signin");
                }, 2000);
            }
        }).catch(error => {
            console.log("error change password: " + error);
            toast.error(messages.changePasswordFailed, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
            });
        })
    }

    validateForm(password, newPassword, confirmPassword) {
        let errors = {}, formIsValid = true;
        if (password.length < 4 || password.length > 40) {
            errors["password"] = messages.passwordLength;
            formIsValid = false;
        }
        else if (newPassword.length < 4 || newPassword.length > 40) {
            errors["newPassword"] = messages.passwordLength;
            formIsValid = false;
        }
        else if (password.toString().localeCompare(newPassword.toString()) === 0) {
            errors["newPassword"] = messages.currentPassword;
            formIsValid = false;
        }
        else if (confirmPassword.toString().localeCompare(newPassword.toString()) != 0) {
            errors["confirmPassword"] = messages.confirmPasswordNotMatch;
            formIsValid = false;
        }

        this.setState({ errors: errors });

        return formIsValid;
    }

    render() {
        return (
            <div className="login-form">
                <h3>ĐỔI MẬT KHẨU</h3>
                <Form onSubmit={(e) => this.handleSubmit(e)}>
                    <FormGroup>
                        <Label for="username">Tên đăng nhập</Label>
                        <Input style={{ width: "20rem" }} type="text" name="username" value={this.state.username} readOnly
                            id="username" placeholder="Nhập tên đăng nhập" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="password">Mật khẩu</Label>
                        <Input style={{ width: "20rem" }} type="password" name="password" required
                            id="password" placeholder="Nhập mật khẩu" onChange={e => this.setState({ password: e.target.value })} />
                        <span style={{ color: "red" }}>{this.state.errors["password"]}</span>
                    </FormGroup>
                    <FormGroup>
                        <Label for="newPassword">Mật khẩu mới</Label>
                        <Input style={{ width: "20rem" }} type="password" name="newPassword" required
                            id="newPassword" placeholder="Nhập mật khẩu mới" onChange={e => this.setState({ newPassword: e.target.value })} />
                        <span style={{ color: "red" }}>{this.state.errors["newPassword"]}</span>
                    </FormGroup>
                    <FormGroup>
                        <Label for="confirmPassword">Xác thực mật khẩu mới</Label>
                        <Input style={{ width: "20rem" }} type="password" name="confirmPassword" required
                            id="confirmPassword" placeholder="Xác thực mật khẩu mới" onChange={e => this.setState({ confirmPassword: e.target.value })} />
                        <span style={{ color: "red" }}>{this.state.errors["confirmPassword"]}</span>
                    </FormGroup>

                    <Button color="info" style={{ marginTop: "1rem" }} type="submit">OK</Button>
                </Form>
            </div>
        );
    }
}

export default withRouter(ChangePassword);