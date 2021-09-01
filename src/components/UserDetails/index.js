import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { endpointUser, putWithAuth, getWithAuth } from '../../components/HttpUtils';
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
    const [gender, setGender] = useState("")
    const [imageStr, setImageStr] = useState()
    const [uploadImage, setUploadImage] = useState(null)
    const [roleArr, setRoleArr] = useState([]);
    const [base64Str, setBase64Str] = useState("")
    const [errors, setErrors] = useState({});

    useEffect(() => {
        fetchUser();
    }, [])

    const fetchUser = () => {
        getWithAuth(endpointUser + "/users/" + localStorage.getItem("username")).then((response) => {
            if (response.status === 200) {
                setUserName(response.data.userName);
                setFullName(response.data.fullName);
                setGender(response.data.gender);
                setAddress(response.data.address);
                setPhoneNumber(response.data.phoneNumber);
                setEmail(response.data.email);
                setImageStr(response.data.photo);
                setRoleArr(response.data.roles);
            }
        }).catch((error) => console.log("Fetching users error: " + error))
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
            "gender": gender,
            "address": address,
            "phoneNumber": phoneNumber,
            "gender": gender,
            "photo": photo,
            "roleIds": roleArr.map(role => role.roleId)
        }
        console.log("Put user body: " + JSON.stringify(userBody));

        putWithAuth(endpointUser + "/users/" + userName, userBody).then((response) => {
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
        </div>
    );
}

export default UserDetails;