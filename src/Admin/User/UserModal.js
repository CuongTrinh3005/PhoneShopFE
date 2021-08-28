import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { endpointUser, postwithAuth, putWithAuth } from '../../components/HttpUtils';
import validator from 'validator';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaPen } from 'react-icons/fa';

toast.configure();
const ModalForm = (props) => {
    const {
        buttonLabel,
        className,
        title,
        color,
        username,
        fullname,
        emailInput,
        phoneNumberInput,
        addressInput,
        genderInput,
        imageInput,
        roleInput,
        getResultInModal,
        insertable
    } = props;

    const [userName, setUserName] = useState(username)
    const [fullName, setFullName] = useState(fullname)
    const [email, setEmail] = useState(emailInput)
    const [phoneNumber, setPhoneNumber] = useState(phoneNumberInput)
    const [address, setAddress] = useState(addressInput)
    const [gender, setGender] = useState(genderInput)
    const [imageStr, setImageStr] = useState(imageInput)
    const [role, setRole] = useState(roleInput)
    const [uploadImage, setUploadImage] = useState(null)

    const [modal, setModal] = useState(false);
    const [checkedRoles, setCheckedRoles] = useState([]);
    const [base64Str, setBase64Str] = useState("")
    const [errors, setErrors] = useState({});
    const toggle = () => setModal(!modal);
    const roles = [{ id: 1, name: "ROLE_USER" }, { id: 2, name: "ROLE_ADMIN" }]

    const updateOrInsertUser = (e) => {
        e.preventDefault();

        if (validateForm() !== true)
            return;

        let photo;
        if (uploadImage === null)
            photo = imageInput;
        else
            photo = getByteaFromBase64Str(base64Str);

        const userBody = {
            "username": userName.trim(),
            "fullName": fullName.trim(),
            "email": email,
            "gender": gender,
            "address": address,
            "phoneNumber": phoneNumber,
            "gender": gender,
            "photo": photo,
            "roleIds": checkedRoles,
        }
        console.log("Put user body: " + JSON.stringify(userBody));

        const userBodyPost = {
            "username": userName.trim(),
            "password": "1234",
            "fullName": fullName.trim(),
            "email": email,
            "address": address,
            "phoneNumber": phoneNumber,
            "gender": gender,
            "photo": photo,
            "roleIds": checkedRoles,
        }

        if (insertable) {
            postwithAuth(endpointUser + "/users", userBodyPost).then((response) => {
                if (response.status === 200 || response.status === 201) {
                    console.log("Insert new user successfully!");

                    toast.success("Insert new user successfully!", {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 2000,
                    });

                    setTimeout(function () {
                        window.location.replace("http://localhost:3000/admin/users");
                    }, 2000);
                    getResultInModal(true);
                }
            }).catch(error => {
                toast.error("Insert user failed! Please check your input and connection!", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000,
                });
                console.log("error inserting new user: " + error);
                getResultInModal(false);
            })
        }
        else {
            putWithAuth(endpointUser + "/users/" + userName, userBody).then((response) => {
                if (response.status === 200) {
                    console.log("Update user successfully!");
                    toast.success("Update user successfully!", {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 2000,
                    });

                    setTimeout(function () {
                        window.location.replace("http://localhost:3000/admin/users");
                    }, 2000);
                    getResultInModal(true);
                }
            }).catch(error => {
                toast.error("Update user failed!" + error.response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000,
                });
                console.log("error update user: " + error);
                getResultInModal(false);
            })
        }
    }

    const getByteaFromBase64Str = () => {
        if (base64Str !== "") {
            const byteArr = base64Str.split(",");
            return byteArr[1];
        }
    }

    const validateForm = () => {
        let errors = {}, formIsValid = true;
        if (userName.trim().indexOf(' ') >= 0) {
            errors['username'] = "Username must not have white space";
            formIsValid = false;
        }
        else if (userName.length < 3 || userName.length > 40) {
            errors['username'] = "Username length must be in range 3 - 40!";
            formIsValid = false;
        }
        else if (fullName.length < 3 || fullName.length > 40) {
            errors['fullName'] = "Full name length must be in range 3 - 40!";
            formIsValid = false;
        }
        else if (validator.isEmail(email) === false) {
            errors['email'] = "Invalid email format!";
            formIsValid = false;
        }
        else if (validator.isMobilePhone(phoneNumber) === false) {
            errors["phoneNumber"] = "Invalid phone number format!";
            formIsValid = false;
        }
        else if (phoneNumber.length < 8 || phoneNumber.length > 14) {
            errors["phoneNumber"] = "Phone Number length is in range 8-14!";
            formIsValid = false;
        }
        else if (checkedRoles.length <= 0 || checkedRoles === null) {
            errors["roles"] = "Please select role for user!";
            formIsValid = false;
        }
        setErrors(errors);

        return formIsValid;
    }

    const handleCheckboxChange = (event) => {
        let options = [], option;
        for (let i = 0, len = event.target.options.length; i < len; i++) {
            option = event.target.options[i];
            if (option.selected) {
                options.push(option.value);
            }
        }
        setCheckedRoles(options);
    }

    const getBase64 = (file, cb) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
            cb(reader.result)
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };
    }

    const onImageChange = event => {
        if (event.target.files && event.target.files[0]) {
            let img = event.target.files[0];

            setUploadImage(URL.createObjectURL(img))

            getBase64(event.target.files[0], (result) => {
                setBase64Str(result);
            });
        }
    };

    return (
        <div>
            {insertable ? <Button color={color} onClick={toggle}>{buttonLabel}</Button>
                : <FaPen onClick={toggle} />}

            <Modal isOpen={modal} toggle={toggle} className={className}>
                <ModalHeader toggle={toggle}>{title}</ModalHeader>
                <ModalBody>
                    <Form onSubmit={(e) => updateOrInsertUser(e)}>
                        <FormGroup>
                            <Label for="username">Username</Label>
                            <Input style={{ width: "20rem" }} type="text" name="username" value={userName} required
                                id="username" placeholder="Enter username" onChange={e => setUserName(e.target.value)} />
                            <span style={{ color: "red" }}>{errors["username"]}</span>
                        </FormGroup>
                        <FormGroup>
                            <Label for="fullname">Họ tên</Label>
                            <Input style={{ width: "20rem" }} type="text" name="fullname" value={fullName} required
                                id="fullname" placeholder="Enter full name" onChange={e => setFullName(e.target.value)} />
                            <span style={{ color: "red" }}>{errors["fullName"]}</span>
                        </FormGroup>
                        <FormGroup>
                            <Label for="email">Email</Label>
                            <Input style={{ width: "20rem" }} type="email" name="email" value={email} required
                                id="email" placeholder="Enter email" onChange={e => setEmail(e.target.value)} />
                            <span style={{ color: "red" }}>{errors["email"]}</span>
                        </FormGroup>
                        <FormGroup>
                            <Label for="phoneNumber">Số điện thoại</Label>
                            <Input style={{ width: "20rem" }} type="number" name="phoneNumber" value={phoneNumber}
                                id="phoneNumber" placeholder="Enter phone number" onChange={e => setPhoneNumber(e.target.value)} />
                            <span style={{ color: "red" }}>{errors["phoneNumber"]}</span>
                        </FormGroup>
                        <FormGroup>
                            <Label for="address">Địa chỉ</Label>
                            <Input style={{ width: "20rem" }} type="address" name="address" value={address}
                                id="address" placeholder="Enter address" onChange={e => setAddress(e.target.value)} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="roleSelectMulti">Select role(s)</Label>
                            <Input type="select" name="roles" multiple id="roleSelectMulti" onChange={(event) => { handleCheckboxChange(event) }}>
                                {roles.map((role) => (
                                    <option key={role.id} value={role.id}>{role.name}</option>
                                ))}
                            </Input>
                            <span style={{ color: "red" }}>{errors["roles"]}</span>
                        </FormGroup>
                        <FormGroup>
                            <Label for="genderSelect">Giới tính</Label>
                            <Input type="select" name="gender" id="genderSelect" defaultValue={true} onChange={e => setGender(e.target.value)}>
                                <option key={1} value={true} selected>MALE</option>
                                <option key={2} value={false}>FEMALE</option>
                            </Input>
                        </FormGroup>
                        <FormGroup>
                            <Label for="photoFile">Ảnh</Label>
                            <Input type="file" name="photo" id="photoFile" accept="image/*" onChange={(e) => onImageChange(e)} />
                            <FormText color="muted">
                                Upload ảnh
                            </FormText>
                            {uploadImage !== null ?
                                <img src={uploadImage} width="200" height="100" alt="No image" />
                                :
                                <img src={`data:image/jpeg;base64,${imageStr}`} width="200" height="100" alt="No image" />
                            }
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={updateOrInsertUser}>OK</Button>
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default ModalForm;