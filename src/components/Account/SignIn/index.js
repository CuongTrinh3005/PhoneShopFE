import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import './SignIn.css'
import { endpointAuth, post } from '../../HttpUtils';
import { Link } from 'react-router-dom';

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
                alert("Login successfully!");
                this.props.getLoginName(response.data.username);
                window.location.replace("http://localhost:3000/")
            }
        }).catch(error => {
            console.log("error sigin: " + error);
            // alert("Login failed! Check your input and try again!");
            alert(error.response.data.message);
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
            errors['username'] = "Length of username is in range of 3 to 40";
            formIsValid = false;
        }
        else if (password.length < 4 || password.length > 40) {
            errors['password'] = "Length of password is in range of 4 to 40";
            formIsValid = false;
        }
        this.setState({ errors: errors })

        return formIsValid;
    }

    render() {
        return (
            <div className="login-form">
                <h3>LOGIN FORM</h3>
                <Form onSubmit={(e) => this.handleSubmit(e)}>
                    <FormGroup>
                        <Label for="username">Username</Label>
                        <Input style={{ width: "20rem" }} type="text" name="username" required
                            id="username" placeholder="Enter your username" onChange={e => this.setState({ username: e.target.value })} />
                        <span style={{ color: "red" }}>{this.state.errors["username"]}</span>
                    </FormGroup>
                    <FormGroup>
                        <Label for="password">Password</Label>
                        <Input style={{ width: "20rem" }} type="password" name="password" required
                            id="password" placeholder="Enter your password" onChange={e => this.setState({ password: e.target.value })} />
                        <span style={{ color: "red" }}>{this.state.errors["password"]}</span>
                    </FormGroup>
                    <Button color="info" style={{ marginTop: "1rem" }} type="submit">Sign In</Button>
                    <Link to="/account/reset-password"><p>Forgot password ?</p></Link>
                </Form>
            </div>
        );
    }
}

export default Login;