import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import './SignUp.css'
import { endpointAuth, hostFrontend, post } from '../../HttpUtils';
import validator from 'validator';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { messages } from '../../message';

toast.configure();
class SignUp extends Component {
    state = { username: "", password: "", email: "", message: "", fullName: "", phoneNumber: "", errors: {} };

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
            if (response.status === 200 || response.status === 201) {
                this.setState({ message: response.data.message })
                toast.success(messages.registerSuccess, {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000,
                });

                setTimeout(function () {
                    window.location.replace(hostFrontend + "account/signin");
                }, 2000);
            }
        }).catch(error => {
            console.log("error signup: " + error);
            toast.error(messages.registerFailed, {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
            });
            console.log(error.response.data);
            console.log(error.response.status);
            console.log(error.response.headers);
        })
    }

    validateForm(username, password, email, fullName, phoneNumber) {
        let errors = {}, formIsValid = true;
        if (username.indexOf(' ') >= 0) {
            errors["username"] = messages.usernameContainsSpace;
            formIsValid = false;
        }
        else if (username.length < 3 || username.length > 40) {
            errors["username"] = messages.usernameLength;
            formIsValid = false;
        }
        else if (password.length < 4 || password.length > 40) {
            errors["password"] = messages.passwordLength;
            formIsValid = false;
        }
        else if (fullName.length < 3 || fullName.length > 50) {
            errors["fullName"] = messages.fullNameLength;
            formIsValid = false;
        }
        else if (validator.isEmail(email) === false) {
            errors["email"] = messages.invalidEmailFormat;
            formIsValid = false;
        }
        else if (validator.isMobilePhone(phoneNumber) === false) {
            errors["phoneNumber"] = messages.invalidPhoneNumberFormat;
            formIsValid = false;
        }
        else if (phoneNumber.length < 8 || phoneNumber.length > 14) {
            errors["phoneNumber"] = messages.phoneNumberLength;
            formIsValid = false;
        }
        this.setState({ errors: errors });

        return formIsValid;
    }

    render() {
        return (
            <div className="login-form">
                <h3>????NG K?? T??I KHO???N</h3>
                <Form onSubmit={(e) => this.handleSubmit(e)}>
                    <FormGroup>
                        <Label for="username">T??n ????ng nh???p</Label>
                        <Input style={{ width: "20rem" }} type="text" name="username" required
                            id="username" placeholder="Nh???p t??n ????ng nh???p" onChange={e => this.setState({ username: e.target.value })} />
                        <span style={{ color: "red" }}>{this.state.errors["username"]}</span>
                    </FormGroup>
                    <FormGroup>
                        <Label for="password">M???t kh???u</Label>
                        <Input style={{ width: "20rem" }} type="password" name="password" required
                            id="password" placeholder="Nh???p m???t kh???u" onChange={e => this.setState({ password: e.target.value })} />
                        <span style={{ color: "red" }}>{this.state.errors["password"]}</span>
                    </FormGroup>
                    <FormGroup>
                        <Label for="email">Email</Label>
                        <Input style={{ width: "20rem" }} type="email" name="email" required
                            id="email" placeholder="Nh???p email" onChange={e => this.setState({ email: e.target.value })} />
                        <span style={{ color: "red" }}>{this.state.errors["email"]}</span>
                    </FormGroup>
                    <FormGroup>
                        <Label for="fullName">H??? t??n</Label>
                        <Input style={{ width: "20rem" }} type="text" name="fullName" required
                            id="fullName" placeholder="Nh???p h??? t??n" onChange={e => this.setState({ fullName: e.target.value })} />
                        <span style={{ color: "red" }}>{this.state.errors["fullName"]}</span>
                    </FormGroup>
                    <FormGroup>
                        <Label for="phoneNumber">S??? ??i???n tho???i</Label>
                        <Input style={{ width: "20rem" }} type="tel" name="phoneNumber" required
                            id="phoneNumber" placeholder="Enter your s??? ??i???n tho???i" onChange={e => this.setState({ phoneNumber: e.target.value })} />
                        <span style={{ color: "red" }}>{this.state.errors["phoneNumber"]}</span>
                    </FormGroup>

                    <Button color="info" style={{ marginTop: "1rem" }} type="submit">????ng k??</Button>
                </Form>
            </div>
        );
    }
}

export default SignUp;