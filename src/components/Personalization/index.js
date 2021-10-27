import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Label, Input, CustomInput } from 'reactstrap';
import { endpointUser, putWithAuth, getWithAuth, hostFrontend } from '../../components/HttpUtils';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { messages } from '../message';

toast.configure();
const Personalization = () => {
    const [userName, setUserName] = useState("")
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [address, setAddress] = useState("")
    const [birthday, setBirthday] = useState(new Date())
    const [gender, setGender] = useState("")
    const [imageStr, setImageStr] = useState()
    const [roleName, setRoleName] = useState([]);
    const [commonDemand, setCommonDemand] = useState(0)
    const [entertainmentDemand, setEntertainmentDemand] = useState(0)
    const [gamingDemand, setGamingDemand] = useState(0)

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

                setCommonDemand(response.data.commonCoef)
                setEntertainmentDemand(response.data.entertainCoef)
                setGamingDemand(response.data.gamingCoef)
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

        const userBody = {
            "username": userName.trim(),
            "fullName": fullName.trim(),
            "email": email,
            "phoneNumber": phoneNumber,
            "address": address,
            "image": imageStr,
            "gender": gender,
            "birthday": birthday,
            "roleName": roleName,
            "commonCoef": commonDemand,
            "entertainCoef": entertainmentDemand,
            "gamingCoef": gamingDemand
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

    const handleCommonDemandChange = (event) => {
        if (event.target.checked)
            setCommonDemand(1);
        else setCommonDemand(0);
    }

    const handleEntertainmentDemandChange = (event) => {
        if (event.target.checked)
            setEntertainmentDemand(1);
        else setEntertainmentDemand(0);
    }

    const handleGamingDemandChange = (event) => {
        if (event.target.checked)
            setGamingDemand(1);
        else setGamingDemand(0);
    }

    return (
        <div >
            <h3 style={{ marginTop: "1rem" }}>KHẢO SÁT NHU CẦU</h3>
            <p>Xin chào <strong>{userName}</strong> , chúng tôi khuyên bạn nên dành chút ít thời gian để hoàn thành form khảo sát này bằng cách tích vào các
                hiệu năng của sản phẩm mà bạn quan tâm.</p>
            <br />
            Từ đó thuật toán của chúng tôi sẽ gợi ý cho bạn các mặt hàng thuộc quan tâm của bạn được
            các bạn dùng khác đánh giá cao trong lần sau bạn ghé thăm website.
            Bạn có thể chỉnh sửa nó trong tương lai theo nhu cầu của mình.
            <Form onSubmit={(e) => updateUser(e)}>
                <FormGroup>
                    <strong><Label for="commonCheckbox">Nhu cầu cho sản phẩm thông thường (nghe, gọi)</Label></strong>
                    <CustomInput type="checkbox" id="commonCheckbox" label="  Nhu cầu cho sản phẩm thông thường (chỉ nghe, gọi)"
                        name="commonCheckbox" defaultChecked={true}
                        checked={commonDemand === 1} onChange={(e) => handleCommonDemandChange(e)} />
                </FormGroup>
                <FormGroup>
                    <strong><Label for="entertainmentCheckbox">Nhu cầu cho sản phẩm giải trí</Label></strong>
                    <CustomInput type="checkbox" id="entertainmentCheckbox"
                        label="  Nhu cầu cho sản phẩm giải trí (nghe nhạc, xem phim,...)"
                        name="entertainmentCheckbox" defaultChecked={false}
                        checked={entertainmentDemand === 1} onChange={(e) => handleEntertainmentDemandChange(e)} />
                </FormGroup>
                <FormGroup>
                    <strong><Label for="gamingCheckbox">Nhu cầu cho sản phẩm hỗ trợ gaming</Label></strong>
                    <CustomInput type="checkbox" id="gamingCheckbox"
                        label="  Nhu cầu cho sản phẩm gaming/ cấu hình cao"
                        name="gamingCheckbox" defaultChecked={false}
                        checked={gamingDemand === 1} onChange={(e) => handleGamingDemandChange(e)} />
                </FormGroup>

                <Button color="info" style={{ marginTop: "1rem" }} type="submit">CẬP NHẬT</Button>
            </Form>
        </div >
    );
}

export default Personalization;