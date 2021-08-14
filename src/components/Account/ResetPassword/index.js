import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import { endpointPublic, get } from '../../HttpUtils';

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
                alert("Reset password successfully! Please check your email!");
                window.location.replace("http://localhost:3000/account/signin");
            }
        }).catch(error => {
            console.log("error reset password: " + error);
            alert("Reset password failed!");
        })
    }

    validateForm(username) {
        let errors = {}, formIsValid = true;
        if (username.indexOf(' ') >= 0) {
            errors["username"] = "Username must not contain white space!";
            formIsValid = false;
        }
        else if (username.length < 3 || username.length > 40) {
            errors['username'] = "Length of username is in range of 3 to 40";
            formIsValid = false;
        }

        this.setState({ errors: errors })

        return formIsValid;
    }

    render() {
        return (
            <div className="login-form">
                <h3>RESET PASSWORD FORM</h3>
                <Form onSubmit={(e) => this.handleSubmit(e)}>
                    <FormGroup>
                        <Label for="username">Username</Label>
                        <Input style={{ width: "20rem" }} type="text" name="username" required
                            id="username" placeholder="Enter your username" onChange={e => this.setState({ username: e.target.value })} />
                        <span style={{ color: "red" }}>{this.state.errors["username"]}</span>
                    </FormGroup>
                    <Button color="info" style={{ marginTop: "1rem" }} type="submit">RESET PASSWORD</Button>
                </Form>
            </div>
        );
    }
}

export default ResetPassword;