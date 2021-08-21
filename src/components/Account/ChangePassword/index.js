import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { endpointUser, postwithAuth } from '../../HttpUtils';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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

                toast.success("Change password successfully! Please login to proceed!", {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000,
                });
                setTimeout(function () {
                    window.location.replace("http://localhost:3000/account/signin");
                }, 2000);
            }
        }).catch(error => {
            console.log("error change password: " + error);
            toast.error("Change password failed! Contact administrator for instruction!", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
            });
        })
    }

    validateForm(password, newPassword, confirmPassword) {
        let errors = {}, formIsValid = true;
        if (password.length < 4 || password.length > 40) {
            errors["password"] = "Length of password is in range of 4 to 40";
            formIsValid = false;
        }
        else if (newPassword.length < 4 || newPassword.length > 40) {
            errors["newPassword"] = "Length of password is in range of 4 to 40";
            formIsValid = false;
        }
        else if (password.toString().localeCompare(newPassword.toString()) === 0) {
            errors["newPassword"] = "You entered the current password!";
            formIsValid = false;
        }
        else if (confirmPassword.toString().localeCompare(newPassword.toString()) != 0) {
            errors["confirmPassword"] = "Password confirm not match new password!";
            formIsValid = false;
        }

        this.setState({ errors: errors });

        return formIsValid;
    }

    render() {
        return (
            <div className="login-form">
                <h3>CHANGE PASSWORD FORM</h3>
                <Form onSubmit={(e) => this.handleSubmit(e)}>
                    <span style={{ color: "green" }}>{this.state.message}</span>
                    <FormGroup>
                        <Label for="username">Username</Label>
                        <Input style={{ width: "20rem" }} type="text" name="username" value={this.state.username} readOnly
                            id="username" placeholder="Enter your username" />
                    </FormGroup>
                    <FormGroup>
                        <Label for="password">Password</Label>
                        <Input style={{ width: "20rem" }} type="password" name="password" required
                            id="password" placeholder="Enter your password" onChange={e => this.setState({ password: e.target.value })} />
                        <span style={{ color: "red" }}>{this.state.errors["password"]}</span>
                    </FormGroup>
                    <FormGroup>
                        <Label for="newPassword">New password</Label>
                        <Input style={{ width: "20rem" }} type="password" name="newPassword" required
                            id="newPassword" placeholder="Enter your new password" onChange={e => this.setState({ newPassword: e.target.value })} />
                        <span style={{ color: "red" }}>{this.state.errors["newPassword"]}</span>
                    </FormGroup>
                    <FormGroup>
                        <Label for="confirmPassword">ConfirmPassword new password</Label>
                        <Input style={{ width: "20rem" }} type="password" name="confirmPassword" required
                            id="confirmPassword" placeholder="Confirm your new password" onChange={e => this.setState({ confirmPassword: e.target.value })} />
                        <span style={{ color: "red" }}>{this.state.errors["confirmPassword"]}</span>
                    </FormGroup>

                    <Button color="info" style={{ marginTop: "1rem" }} type="submit">OK</Button>
                </Form>
            </div>
        );
    }
}

export default withRouter(ChangePassword);