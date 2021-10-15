import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { endpointAdmin, endpointUser, hostFrontend, postwithAuth, putWithAuth } from '../../components/HttpUtils';
import validator from 'validator';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaPen } from 'react-icons/fa';
import { messages } from '../../components/message';

toast.configure();
const ModalForm = (props) => {
    const {
        buttonLabel,
        className,
        title,
        color,
        userId,
        username,
        fullname,
        emailInput,
        phoneNumberInput,
        addressInput,
        genderInput,
        imageInput,
        roleInput,
        birthday,
        getResultInModal,
        insertable,
        deleted
    } = props;

    const [userIdModal, setUserIdModal] = useState(userId);
    const [userName, setUserName] = useState(username)
    const [fullName, setFullName] = useState(fullname)
    const [email, setEmail] = useState(emailInput)
    const [phoneNumber, setPhoneNumber] = useState(phoneNumberInput)
    const [address, setAddress] = useState(addressInput)
    const [gender, setGender] = useState(genderInput)
    const [imageStr] = useState(imageInput)
    const [uploadImage, setUploadImage] = useState(null)
    const [birthdayModal, setBirthdayModal] = useState(birthday);
    const [modal, setModal] = useState(false);
    const [checkedRoles, setCheckedRoles] = useState([]);
    const [base64Str, setBase64Str] = useState("")
    const [errors, setErrors] = useState({});
    const toggle = () => {
        if (deleted === true) {
            toast.info(messages.updateAfterDeleted, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
            });

            setTimeout(function () {
                window.location.reload();
            }, 2000);
        }
        setModal(!modal);
    }
    const roles = [{ id: 1, name: "User" }, { id: 2, name: "Admin" }]

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
            "phoneNumber": phoneNumber,
            "address": address,
            "image": photo,
            "gender": gender,
            "birthday": birthdayModal,
            "roleName": processCheckRolesToSendRequest()
        }
        console.log("Put user body: " + JSON.stringify(userBody));

        if (insertable) {
            postwithAuth(endpointAdmin + "/users", userBody).then((response) => {
                if (response.status === 200 || response.status === 201) {
                    console.log("Insert new user successfully!");

                    toast.success(messages.insertSuccess, {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 2000,
                    });

                    setTimeout(function () {
                        window.location.replace(hostFrontend + "admin/users");
                    }, 2000);
                    getResultInModal(true);
                }
            }).catch(error => {
                toast.error(messages.insertFailed + " Username hoặc email đã tồn tại!", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000,
                });
                console.log("error inserting new user: " + error);
                getResultInModal(false);
            })
        }
        else {
            putWithAuth(endpointUser + "/users/" + userIdModal, userBody).then((response) => {
                if (response.status === 200) {
                    console.log(messages.updateSuccess);
                    toast.success(messages.updateSuccess, {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 2000,
                    });

                    setTimeout(function () {
                        window.location.replace(hostFrontend + "admin/users");
                    }, 2000);
                    getResultInModal(true);
                }
            }).catch(error => {
                toast.error(messages.updateFailed + " Username hoặc email đã tồn tại!", {
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
            errors['username'] = messages.usernameContainsSpace;
            formIsValid = false;
        }
        else if (userName.length < 3 || userName.length > 40) {
            errors['username'] = messages.usernameLength;
            formIsValid = false;
        }
        else if (fullName.length < 3 || fullName.length > 40) {
            errors['fullName'] = messages.fullNameLength;
            formIsValid = false;
        }
        else if (validator.isEmail(email) === false) {
            errors['email'] = messages.invalidEmailFormat;
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
        else if (checkedRoles.length === 0) {
            errors["roles"] = messages.roleSelect;
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

    const processRoleArr = (roleStr) => {
        if (roleStr !== "") {
            const roleStrArr = roleStr.trim().split(" ");
            let roleIds = [];
            for (let index = 0; index < roleStrArr.length; index++) {
                if (roleStrArr[index] === 'User')
                    roleIds.push(1);
                else roleIds.push(2)
            }
            setCheckedRoles(roleIds);
        }
    }

    const processCheckRolesToSendRequest = () => {
        let roleNames = '';
        for (let index = 0; index < checkedRoles.length; index++) {
            if (checkedRoles[index] === "1") {
                roleNames += "user";
            }
            else roleNames += "admin";
            if (index < checkedRoles.length - 1) {
                roleNames += ", ";
            }
        }
        return roleNames;
    }

    useEffect(() => {
        processRoleArr(roleInput);
    }, []);

    var year_to_allow = 16;

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
                            <Input style={{ width: "20rem" }} type="text" name="username" value={userName} required readOnly={!insertable}
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
                                    <option key={role.id}
                                        selected={checkedRoles.includes(role.id)}
                                        value={role.id}>{role.name}</option>
                                ))}
                            </Input>
                            <span style={{ color: "red" }}>{errors["roles"]}</span>
                        </FormGroup>
                        <FormGroup>
                            <Label for="birthday">Chọn ngày sinh</Label>
                            {!insertable ?
                                <Input type="date" name="birthday" id="birthday"
                                    max={new Date((new Date().valueOf() - ((365 * year_to_allow) * 24 * 60 * 60 * 1000))).toISOString().split('T')[0]}
                                    min={new Date((new Date().valueOf() - ((365 * 90) * 24 * 60 * 60 * 1000))).toISOString().split('T')[0]}
                                    value={new Date(birthdayModal).toISOString().split("T")[0]}
                                    defaultValue={new Date(birthdayModal).toISOString().split("T")[0]}
                                    onChange={e => setBirthdayModal(e.target.value)}
                                    style={{ width: "20rem" }}>
                                </Input>
                                :
                                <Input type="date" name="birthday" id="birthday"
                                    max={new Date((new Date().valueOf() - ((365 * year_to_allow) * 24 * 60 * 60 * 1000))).toISOString().split('T')[0]}
                                    min={new Date((new Date().valueOf() - ((365 * 90) * 24 * 60 * 60 * 1000))).toISOString().split('T')[0]}
                                    onChange={e => setBirthdayModal(e.target.value)}
                                    style={{ width: "20rem" }}>
                                </Input>
                            }

                        </FormGroup>
                        <FormGroup>
                            <Label for="genderSelect">Giới tính</Label>
                            <Input type="select" name="gender" id="genderSelect" onChange={e => setGender(e.target.value)}>
                                <option key={1} value={true} selected={gender === true}>MALE</option>
                                <option key={2} value={false} selected={gender === false}>FEMALE</option>
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