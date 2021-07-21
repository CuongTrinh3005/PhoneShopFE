import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import './SignUp.css'
import { endpointAuth, get, post } from '../../HttpUtils';

class Login extends Component {
    state = { username: "", password: "", email: "", message: "" };

    handleSubmit(e) {
        e.preventDefault();
        if (this.validateForm(e.target.username.value, e.target.password.value) !== true)
            return;

        this.setState({ username: e.target.username.value })
        this.setState({ password: e.target.password.value })
        this.setState({ email: e.target.email.value })

        const personalInfo = { username: this.state.username, password: this.state.password, email: this.state.email };

        post(endpointAuth + "/signup", personalInfo).then((response) => {
            if (response.status === 200) {
                this.setState({ message: response.data.message })
                alert(response.data.message + " .Please login to proceed!");
                window.location.replace("http://localhost:3000/account/signin");
            }
        }).catch(error => {
            console.log("error signup: " + error);
            alert("Maybe username or email is already existed! Please try again!");
        })
    }

    validateForm(username, password) {
        if (username === null || username === '' || password === null || password === '') {
            alert("Do not let input empty!");
            return false;
        }
        else if (username.length < 3 || username.length > 40) {
            alert("Length of username is in range of 3 to 40");
            return false;
        }
        else if (password.length < 4 || password.length > 40) {
            alert("Length of password is in range of 4 to 40");
            return false;
        }

        return true;
    }

    render() {
        return (
            <div className="login-form">
                <h3>REGISTER FORM</h3>
                <Form onSubmit={(e) => this.handleSubmit(e)}>
                    <FormGroup>
                        <Label for="username">Username</Label>
                        <Input style={{ width: "20rem" }} type="text" name="username"
                            id="username" placeholder="Enter your username" onChange={e => this.setState({ username: e.target.value })} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="password">Password</Label>
                        <Input style={{ width: "20rem" }} type="password" name="password"
                            id="password" placeholder="Enter your password" onChange={e => this.setState({ password: e.target.value })} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="email">Email</Label>
                        <Input style={{ width: "20rem" }} type="email" name="email"
                            id="email" placeholder="Enter your email" onChange={e => this.setState({ email: e.target.value })} />
                    </FormGroup>
                    <Button color="info" style={{ marginTop: "1rem" }} type="submit">Sign Up</Button>
                </Form>
            </div>
        );
    }
}

export default Login;