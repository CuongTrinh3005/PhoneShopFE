import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { endpointUser, putWithAuth, getWithAuth, hostFrontend } from '../../components/HttpUtils';
import validator from 'validator';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { messages } from '../message';

toast.configure();
const UserDetails = () => {
    const [userName, setUserName] = useState("")
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [address, setAddress] = useState("")
    const [birthday, setBirthday] = useState(new Date())
    const [gender, setGender] = useState("")
    const [imageStr, setImageStr] = useState()
    const [uploadImage, setUploadImage] = useState(null)
    const [roleName, setRoleName] = useState([]);
    const [base64Str, setBase64Str] = useState("")
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchUser();
    }, [])

    const fetchUser = () => {
        getWithAuth(endpointUser + "/users?username=" + localStorage.getItem("username")).then((response) => {
            if (response.status === 200) {
                setUserName(response.data.username);
                setFullName(response.data.fullName);
                setGender(response.data.gender);
                setAddress(response.data.address);
                setPhoneNumber(response.data.phoneNumber);
                setEmail(response.data.email);
                setImageStr(response.data.image);
                setRoleName(response.data.roleName);
                setBirthday(response.data.birthday);
                console.log("Birthday : ", new Date(response.data.birthday).toISOString().split("T")[0]);
            }
        }).catch((error) => {
            console.log("Fetching users error: " + error);
            toast.success("Vui lòng đăng nhập lại!", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 1500,
            });
            setTimeout(function () {
                window.location.replace(hostFrontend + "account/signin");
            }, 2000);
        })
    }

    const updateUser = (e) => {
        e.preventDefault();

        if (!validateForm())
            return;

        let photo;
        if (uploadImage === null)
            photo = imageStr;
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
            "birthday": birthday,
            "roleName": roleName
        }
        console.log("Put user body: " + JSON.stringify(userBody));

        putWithAuth(endpointUser + "/users/" + localStorage.getItem("userId"), userBody).then((response) => {
            if (response.status === 200) {
                console.log("Update user successfully!");

                toast.success(messages.updateUserSuccess, {
                    position: toast.POSITION.TOP_CENTER,
                    autoClose: 2000,
                });
            }
        }).catch(error => {
            toast.error(messages.updateUserFailed + "Tên đăng nhập hoặc email đã bị trùng!", {
                position: toast.POSITION.TOP_CENTER,
                autoClose: 2000,
            });
            console.log("error update user: " + error);
        })
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
        setErrors(errors);

        return formIsValid;
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

    var year_to_allow = 16;

    return (
        <div>
            <h3>THÔNG TIN NGƯỜI DÙNG</h3>
            <Form onSubmit={(e) => updateUser(e)}>
                <FormGroup>
                    <Label for="username">Tên đăng nhập</Label>
                    <Input style={{ width: "20rem" }} type="text" name="username" value={userName} readOnly
                        id="username" placeholder="Nhập tên đăng nhập" onChange={e => setUserName(e.target.value)} />
                    <span style={{ color: "red" }}>{errors["username"]}</span>
                </FormGroup>
                <FormGroup>
                    <Label for="fullname">Họ tên</Label>
                    <Input style={{ width: "20rem" }} type="text" name="fullname" value={fullName} required
                        id="fullname" placeholder="Nhập họ tên" onChange={e => setFullName(e.target.value)} />
                    <span style={{ color: "red" }}>{errors["fullName"]}</span>
                </FormGroup>
                <FormGroup>
                    <Label for="email">Email</Label>
                    <Input style={{ width: "20rem" }} type="email" name="email" value={email} required
                        id="email" placeholder="Nhập email" onChange={e => setEmail(e.target.value)} />
                    <span style={{ color: "red" }}>{errors["email"]}</span>
                </FormGroup>
                <FormGroup>
                    <Label for="phoneNumber">Số điện thoại</Label>
                    <Input style={{ width: "20rem" }} type="number" name="phoneNumber" value={phoneNumber}
                        id="phoneNumber" placeholder="Nhập số điện thoại" onChange={e => setPhoneNumber(e.target.value)} />
                    <span style={{ color: "red" }}>{errors["phoneNumber"]}</span>
                </FormGroup>
                <FormGroup>
                    <Label for="address">Địa chỉ</Label>
                    <Input style={{ width: "20rem" }} type="address" name="address" value={address}
                        id="address" placeholder="Nhập địa chỉ" onChange={e => setAddress(e.target.value)} />
                </FormGroup>
                <FormGroup>
                    <Label for="birthday">Chọn ngày sinh</Label>
                    <Input type="date" name="birthday" id="birthday"
                        max={new Date((new Date().valueOf() - ((365 * year_to_allow) * 24 * 60 * 60 * 1000))).toISOString().split('T')[0]}
                        min={new Date((new Date().valueOf() - ((365 * 90) * 24 * 60 * 60 * 1000))).toISOString().split('T')[0]}
                        value={new Date(birthday).toISOString().split("T")[0]}
                        defaultValue={new Date(birthday).toISOString().split("T")[0]}
                        onChange={e => setBirthday(e.target.value)}
                        style={{ width: "20rem" }}>
                    </Input>
                </FormGroup>
                <FormGroup>
                    <Label for="genderSelect">Chọn giới tính</Label>
                    <Input type="select" name="gender" id="genderSelect"
                        onChange={e => setGender(e.target.value)}
                        style={{ width: "8rem" }}>
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
                <Button color="info" style={{ marginTop: "1rem" }} type="submit">CẬP NHẬT</Button>
            </Form>
        </div >
    );
}

export default UserDetails;