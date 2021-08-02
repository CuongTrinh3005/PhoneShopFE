import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import './SignUp.css'
import { endpointAuth, post } from '../../HttpUtils';
import validator from 'validator';

class Login extends Component {
    state = { username: "", password: "", email: "", message: "", fullName: "", phoneNumber: "" };

    handleSubmit(e) {
        e.preventDefault();
        if (this.validateForm(e.target.username.value.trim(), e.target.password.value.trim(),
            e.target.email.value.trim(), e.target.fullName.value.trim(),
            e.target.phoneNumber.value.trim()) !== true)
            return;

        this.setState({ username: e.target.username.value.trim() })
        this.setState({ password: e.target.password.value.trim() })
        this.setState({ email: e.target.email.value.trim() })
        this.setState({ fullName: e.target.fullName.value.trim() })
        this.setState({ phoneNumber: e.target.phoneNumber.value.trim() })

        const personalInfo = {
            username: this.state.username,
            password: this.state.password, email: this.state.email,
            fullName: this.state.fullName, phoneNumber: this.state.phoneNumber
        };

        console.log("Personal info: " + JSON.stringify(personalInfo));

        post(endpointAuth + "/signup", personalInfo).then((response) => {
            if (response.status === 200) {
                this.setState({ message: response.data.message })
                alert(response.data.message + " .Please login to proceed!");
                window.location.replace("http://localhost:3000/account/signin");
            }
        }).catch(error => {
            console.log("error signup: " + error);
            alert(error.response.data.message);
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        })
    }

    validateForm(username, password, email, fullName, phoneNumber) {
        if (username.trim().indexOf(' ') >= 0) {
            alert("Username must not contain white space!");
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
        else if (fullName.length < 3 || fullName.length > 50) {
            alert("Length of full name is in range of 3 to 50");
            return false;
        }
        else if (validator.isEmail(email) === false) {
            alert("Invalid email format!");
            return false;
        }
        else if (validator.isMobilePhone(phoneNumber) === false) {
            alert("Invalid phone number format!");
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
                        <Input style={{ width: "20rem" }} type="text" name="username" required
                            id="username" placeholder="Enter your username" onChange={e => this.setState({ username: e.target.value })} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="password">Password</Label>
                        <Input style={{ width: "20rem" }} type="password" name="password" required
                            id="password" placeholder="Enter your password" onChange={e => this.setState({ password: e.target.value })} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="email">Email</Label>
                        <Input style={{ width: "20rem" }} type="email" name="email" required
                            id="email" placeholder="Enter your email" onChange={e => this.setState({ email: e.target.value })} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="fullName">Full Name</Label>
                        <Input style={{ width: "20rem" }} type="text" name="fullName" required
                            id="fullName" placeholder="Enter your full name" onChange={e => this.setState({ fullName: e.target.value })} />
                    </FormGroup>
                    <FormGroup>
                        <Label for="phoneNumber">Phone Number</Label>
                        <Input style={{ width: "20rem" }} type="tel" name="phoneNumber" required
                            id="phoneNumber" placeholder="Enter your phone number" onChange={e => this.setState({ phoneNumber: e.target.value })} />
                    </FormGroup>

                    <Button color="info" style={{ marginTop: "1rem" }} type="submit">Sign Up</Button>
                </Form>
            </div>
        );
    }
}

export default Login;