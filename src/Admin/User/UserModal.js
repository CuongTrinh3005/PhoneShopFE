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
        hollyName,
        lastName,
        firstName,
        emailInput,
        dadPhoneNumberInput,
        momPhoneNumberInput,
        addressInput,
        genderInput,
        imageInput,
        familyCodeInput,
        roleInput,
        birthday,
        startDate,
        christenDate,
        confirmationDate,
        endDate,
        getResultInModal,
        insertable,
        deleted
    } = props;

    const [userIdModal, setUserIdModal] = useState(userId);
    const [userName, setUserName] = useState(username)
    const [hollyNameModal, setHollyName] = useState(hollyName);
    const [lastNameModal, setLastName] = useState(lastName);
    const [firstNameModal, setFirstName] = useState(firstName);
    const [email, setEmail] = useState(emailInput)
    const [dadPhoneNumber, setDadPhoneNumber] = useState(dadPhoneNumberInput)
    const [momPhoneNumber, setMomPhoneNumber] = useState(momPhoneNumberInput)
    const [address, setAddress] = useState(addressInput)
    const [gender, setGender] = useState(genderInput)
    const [imageStr] = useState(imageInput)
    const [uploadImage, setUploadImage] = useState(null)
    const [birthdayModal, setBirthdayModal] = useState(birthday);
    const [startDateModal, setStartDateModal] = useState(startDate);
    const [christenDateModal, setChristenDateModal] = useState(christenDate);
    const [confirmationDateModal, setConfirmationDateModal] = useState(confirmationDate);
    const [endDateModal, setEndDateModal] = useState(endDate);
    const [familyCode, setFamilyCode] = useState(familyCodeInput);
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
    const roles = [{ id: 1, name: "Admin" }, { id: 2, name: "User" }]

    const updateOrInsertUser = (e) => {
        e.preventDefault();

        // if (validateForm() !== true)
        //     return;

        // let photo;
        // if (uploadImage === null)
        //     photo = imageInput;
        // else
        //     photo = getByteaFromBase64Str(base64Str);

        const userBody = {
            "hollyName": hollyNameModal.trim(),
            "firstName": firstNameModal.trim(),
            "lastName": lastNameModal.trim(),
            "gender": gender,
            "address": address,
            "dadPhoneNumber": dadPhoneNumber,
            "momPhoneNumber": momPhoneNumber,
            "email": email,
            // "image": photo,
            // "familyCode": familyCode.trim(),
            "birthday": birthdayModal,
            "startDate": startDateModal,
            "christenDate": christenDateModal,
            "confirmationDate": confirmationDateModal,
            "endDate": endDateModal,
            "roleName": processCheckRolesToSendRequest()
        }
        console.log("user body: " + JSON.stringify(userBody));

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
                toast.error(messages.insertFailed + " UserId hoặc email đã tồn tại!", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000,
                });
                console.log("error inserting new user: " + error);
                getResultInModal(false);
            })
        }
        else {
            putWithAuth(endpointAdmin + "/users/" + userIdModal, userBody).then((response) => {
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
        else if (hollyNameModal.length < 3 || hollyNameModal.length > 40) {
            errors['hollyName'] = messages.fullNameLength;
            formIsValid = false;
        }
        else if (lastNameModal.length < 3 || lastNameModal.length > 40) {
            errors['lastName'] = messages.fullNameLength;
            formIsValid = false;
        }
        else if (firstNameModal.length < 3 || firstNameModal.length > 40) {
            errors['firstName'] = messages.fullNameLength;
            formIsValid = false;
        }
        else if (validator.isEmail(email) === false) {
            errors['email'] = messages.invalidEmailFormat;
            formIsValid = false;
        }
        else if (validator.isMobilePhone(dadPhoneNumber) === false) {
            errors["dadPhoneNumber"] = messages.invalidPhoneNumberFormat;
            formIsValid = false;
        }
        else if (validator.isMobilePhone(momPhoneNumber) === false) {
            errors["momPhoneNumber"] = messages.invalidPhoneNumberFormat;
            formIsValid = false;
        }
        else if (dadPhoneNumber.length < 8 || dadPhoneNumber.length > 14) {
            errors["dadPhoneNumber"] = messages.phoneNumberLength;
            formIsValid = false;
        }
        else if (momPhoneNumber.length < 8 || momPhoneNumber.length > 14) {
            errors["momPhoneNumber"] = messages.phoneNumberLength;
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
                    roleIds.push(2);
                else roleIds.push(1)
            }
            setCheckedRoles(roleIds);
        }
    }

    const processCheckRolesToSendRequest = () => {
        let roleNames = '';
        for (let index = 0; index < checkedRoles.length; index++) {
            if (checkedRoles[index] === "1") {
                roleNames += "admin";
            }
            else roleNames += "user";
            if (index < checkedRoles.length - 1) {
                roleNames += ", ";
            }
        }
        return roleNames;
    }

    useEffect(() => {
        processRoleArr(roleInput);
    }, []);

    var year_to_allow = 0;

    return (
        <div>
            {insertable ? <Button color={color} onClick={toggle}>{buttonLabel}</Button>
                : <FaPen onClick={toggle} />}
            <Modal isOpen={modal} toggle={toggle} className={className}>
                <ModalHeader toggle={toggle}>{title}</ModalHeader>
                <ModalBody>
                    <Form onSubmit={(e) => updateOrInsertUser(e)}>
                        <FormGroup>
                            {!insertable ?
                                <div>
                                    <Label for="username">ID</Label>
                                    <Input style={{ width: "20rem" }} type="text" name="username" value={userName} required readOnly={!insertable}
                                        id="username" placeholder="Enter username" onChange={e => setUserName(e.target.value)} />
                                    <span style={{ color: "red" }}>{errors["username"]}</span>
                                </div>
                                : undefined}
                        </FormGroup>
                        <FormGroup>
                            <Label for="hollyName">Tên Thánh</Label>
                            <Input style={{ width: "20rem" }} type="text" name="hollyName" value={hollyNameModal}
                                required id="hollyName" placeholder="Nhập tên thánh"
                                onChange={e => setHollyName(e.target.value)} />
                            <span style={{ color: "red" }}>{errors["hollyName"]}</span>
                        </FormGroup>
                        <FormGroup>
                            <Label for="lastName">Họ & tên lót</Label>
                            <Input style={{ width: "20rem" }} type="text" name="lastName" value={lastNameModal}
                                required id="lastName" placeholder="Nhập họ và tên lót"
                                onChange={e => setLastName(e.target.value)} />
                            <span style={{ color: "red" }}>{errors["lastName"]}</span>
                        </FormGroup>
                        <FormGroup>
                            <Label for="firstName">Tên</Label>
                            <Input style={{ width: "20rem" }} type="text" name="firstName" value={firstNameModal}
                                required id="firstName" placeholder="Nhập họ và tên lót"
                                onChange={e => setFirstName(e.target.value)} />
                            <span style={{ color: "red" }}>{errors["firstName"]}</span>
                        </FormGroup>
                        <FormGroup>
                            <Label for="email">Email</Label>
                            <Input style={{ width: "20rem" }} type="email" name="email" value={email}
                                id="email" placeholder="Nhập email" onChange={e => setEmail(e.target.value)} />
                            <span style={{ color: "red" }}>{errors["email"]}</span>
                        </FormGroup>
                        <FormGroup>
                            <Label for="dadPhoneNumber">Số điện thoại cha</Label>
                            <Input style={{ width: "20rem" }} type="number" name="dadPhoneNumber"
                                value={dadPhoneNumber} id="dadPhoneNumber" placeholder="Số điện thoại cha"
                                onChange={e => setDadPhoneNumber(e.target.value)} />
                            <span style={{ color: "red" }}>{errors["dadPhoneNumber"]}</span>
                        </FormGroup>
                        <FormGroup>
                            <Label for="momPhoneNumber">Số điện thoại cha</Label>
                            <Input style={{ width: "20rem" }} type="number" name="momPhoneNumber"
                                value={momPhoneNumber} id="momPhoneNumber" placeholder="Số điện thoại mẹ"
                                onChange={e => setMomPhoneNumber(e.target.value)} />
                            <span style={{ color: "red" }}>{errors["momPhoneNumber"]}</span>
                        </FormGroup>
                        <FormGroup>
                            <Label for="address">Địa chỉ</Label>
                            <Input style={{ width: "20rem" }} type="address" name="address" value={address}
                                id="address" placeholder="Nhập địa chỉ" onChange={e => setAddress(e.target.value)} />
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
                                    // value={new Date(birthdayModal).toISOString().split("T")[0]}
                                    // defaultValue={new Date(birthdayModal).toISOString().split("T")[0]}
                                    onChange={e => setBirthdayModal(e.target.value)}
                                    style={{ width: "20rem" }}>
                                </Input>
                                :
                                <Input type="date" name="birthday" id="birthday"
                                    // max={new Date((new Date().valueOf() - ((365 * year_to_allow) * 24 * 60 * 60 * 1000))).toISOString().split('T')[0]}
                                    // min={new Date((new Date().valueOf() - ((365 * 90) * 24 * 60 * 60 * 1000))).toISOString().split('T')[0]}
                                    onChange={e => setBirthdayModal(e.target.value)}
                                    style={{ width: "20rem" }}>
                                </Input>
                            }
                        </FormGroup>
                        <FormGroup>
                            <Label for="christenDate">Chọn ngày rửa tội</Label>
                            {!insertable ?
                                <Input type="date" name="christenDate" id="christenDate"
                                    max={new Date((new Date().valueOf() - ((365 * year_to_allow) * 24 * 60 * 60 * 1000))).toISOString().split('T')[0]}
                                    min={new Date((new Date().valueOf() - ((365 * 90) * 24 * 60 * 60 * 1000))).toISOString().split('T')[0]}
                                    // value={new Date(christenDateModal).toISOString().split("T")[0]}
                                    // defaultValue={new Date(christenDateModal).toISOString().split("T")[0]}
                                    onChange={e => setChristenDateModal(e.target.value)}
                                    style={{ width: "20rem" }}>
                                </Input>
                                :
                                <Input type="date" name="christenDate" id="christenDate"
                                    max={new Date((new Date().valueOf() - ((365 * year_to_allow) * 24 * 60 * 60 * 1000))).toISOString().split('T')[0]}
                                    min={new Date((new Date().valueOf() - ((365 * 90) * 24 * 60 * 60 * 1000))).toISOString().split('T')[0]}
                                    onChange={e => setChristenDateModal(e.target.value)}
                                    style={{ width: "20rem" }}>
                                </Input>
                            }
                        </FormGroup>
                        <FormGroup>
                            <Label for="confirmationDate">Chọn ngày thêm sức</Label>
                            {!insertable ?
                                <Input type="date" name="confirmationDate" id="confirmationDate"
                                    max={new Date((new Date().valueOf() - ((365 * year_to_allow) * 24 * 60 * 60 * 1000))).toISOString().split('T')[0]}
                                    min={new Date((new Date().valueOf() - ((365 * 90) * 24 * 60 * 60 * 1000))).toISOString().split('T')[0]}
                                    // value={new Date(confirmationDateModal).toISOString().split("T")[0]}
                                    // defaultValue={new Date(confirmationDateModal).toISOString().split("T")[0]}
                                    onChange={e => setConfirmationDateModal(e.target.value)}
                                    style={{ width: "20rem" }}>
                                </Input>
                                :
                                <Input type="date" name="confirmationDate" id="confirmationDate"
                                    max={new Date((new Date().valueOf() - ((365 * year_to_allow) * 24 * 60 * 60 * 1000))).toISOString().split('T')[0]}
                                    min={new Date((new Date().valueOf() - ((365 * 90) * 24 * 60 * 60 * 1000))).toISOString().split('T')[0]}
                                    onChange={e => setConfirmationDateModal(e.target.value)}
                                    style={{ width: "20rem" }}>
                                </Input>
                            }
                        </FormGroup>
                        <FormGroup>
                            <Label for="startDate">Chọn ngày nhập học</Label>
                            {!insertable ?
                                <Input type="date" name="startDate" id="startDate"
                                    max={new Date((new Date().valueOf() - ((365 * year_to_allow) * 24 * 60 * 60 * 1000))).toISOString().split('T')[0]}
                                    min={new Date((new Date().valueOf() - ((365 * 90) * 24 * 60 * 60 * 1000))).toISOString().split('T')[0]}
                                    // value={new Date(startDateModal).toISOString().split("T")[0]}
                                    // defaultValue={new Date(startDateModal).toISOString().split("T")[0]}
                                    onChange={e => setStartDateModal(e.target.value)}
                                    style={{ width: "20rem" }}>
                                </Input>
                                :
                                <Input type="date" name="startDate" id="startDate"
                                    max={new Date((new Date().valueOf() - ((365 * year_to_allow) * 24 * 60 * 60 * 1000))).toISOString().split('T')[0]}
                                    min={new Date((new Date().valueOf() - ((365 * 90) * 24 * 60 * 60 * 1000))).toISOString().split('T')[0]}
                                    onChange={e => setStartDateModal(e.target.value)}
                                    style={{ width: "20rem" }}>
                                </Input>
                            }
                        </FormGroup>
                        <FormGroup>
                            <Label for="endDate">Chọn ngày tốt nghiệp</Label>
                            {!insertable ?
                                <Input type="date" name="endDate" id="endDate"
                                    max={new Date((new Date().valueOf() - ((365 * year_to_allow) * 24 * 60 * 60 * 1000))).toISOString().split('T')[0]}
                                    min={new Date((new Date().valueOf() - ((365 * 90) * 24 * 60 * 60 * 1000))).toISOString().split('T')[0]}
                                    // value={new Date(endDateModal).toISOString().split("T")[0]}
                                    // defaultValue={new Date(endDateModal).toISOString().split("T")[0]}
                                    onChange={e => setEndDateModal(e.target.value)}
                                    style={{ width: "20rem" }}>
                                </Input>
                                :
                                <Input type="date" name="endDate" id="endDate"
                                    max={new Date((new Date().valueOf() - ((365 * year_to_allow) * 24 * 60 * 60 * 1000))).toISOString().split('T')[0]}
                                    min={new Date((new Date().valueOf() - ((365 * 90) * 24 * 60 * 60 * 1000))).toISOString().split('T')[0]}
                                    onChange={e => setEndDateModal(e.target.value)}
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