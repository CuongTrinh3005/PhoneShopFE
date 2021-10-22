import React, { useState, useEffect } from 'react';
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
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

    return (
        <div style={{ marginLeft: "18rem" }}>
            <h3 style={{ marginTop: "1rem" }}>KHẢO SÁT NHU CẦU</h3>
            <p>Xin chào {userName}, để có thể gợi ý các sản phẩm theo đúng nhu cầu của bạn, chúng tôi khuyên
                bạn nên dành chút ít thời gian để hoàn thành form khảo sát này. Bạn có thể chỉnh sửa nó trong
                tương lai theo nhu cầu của mình.</p>
            <Form onSubmit={(e) => updateUser(e)}>
                <FormGroup>
                    <Label for="common">Nhu cầu cho sản phẩm thông thường (nghe, gọi)</Label>
                    <Input style={{ width: "20rem" }} type="number" defaultValue="0" name="common"
                        value={commonDemand} min="0" max="1" step="0.1"
                        id="common" placeholder="Mức độ nhu cầu cho sản phẩm thông thường (nghe, gọi)"
                        onChange={e => setCommonDemand(e.target.value)} />
                </FormGroup>
                <FormGroup>
                    <Label for="entertainment">Nhu cầu cho sản phẩm giải trí</Label>
                    <Input style={{ width: "20rem" }} type="number" defaultValue="0" name="entertainment"
                        value={entertainmentDemand} min="0" max="1" step="0.1"
                        id="entertainment" placeholder="Mức độ nhu cầu cho sản phẩm giải trí (web, xem phim,...)"
                        onChange={e => setEntertainmentDemand(e.target.value)} />
                </FormGroup>
                <FormGroup>
                    <Label for="game">Nhu cầu cho sản phẩm hỗ trợ gaming</Label>
                    <Input style={{ width: "20rem" }} type="number" defaultValue="0" name="game"
                        value={gamingDemand} min="0" max="1" step="0.1"
                        id="game" placeholder="Mức độ nhu cầu cho sản phẩm chơi game tốt"
                        onChange={e => setGamingDemand(e.target.value)} />
                </FormGroup>

                <Button color="info" style={{ marginTop: "1rem" }} type="submit">CẬP NHẬT</Button>
            </Form>
        </div >
    );
}

export default Personalization;