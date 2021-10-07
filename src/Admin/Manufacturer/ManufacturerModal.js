import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import { endpointAdmin, endpointUser, hostFrontend, postwithAuth, putWithAuth } from '../../components/HttpUtils';
import validator from 'validator';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { messages } from '../../components/message';

toast.configure();
const ManufacturerModal = (props) => {
    const {
        buttonLabel,
        className,
        title,
        color,
        manufacturerId,
        manufacturerName,
        email,
        address,
        phoneNumber,
        country,
        getResultInModal,
        insertable,
        external
    } = props;

    const [id, setId] = useState(manufacturerId)
    const [name, setName] = useState(manufacturerName)
    const [emailInModal, setEmailInModal] = useState(email)
    const [addressInModal, setAddressInModal] = useState(address)
    const [phoneNumberInModal, setPhoneNumberInModal] = useState(phoneNumber)
    const [countryInModal, setCountryInModal] = useState(country)

    const [useExternal] = useState(external);

    const [modal, setModal] = useState(false);
    const [errors, setErrors] = useState({});

    const toggle = () => setModal(!modal);

    const updateManufacturer = (e) => {
        e.preventDefault();
        if (!validateForm(name, emailInModal, addressInModal, phoneNumberInModal))
            return;

        let manufacturerBody = {
            manufacturerId: id, manufacturerName: name.trim(), email: emailInModal
            , address: addressInModal, phoneNumber: phoneNumberInModal, country: countryInModal
        };
        if (countryInModal !== null && countryInModal !== '') {
            manufacturerBody['country'] = countryInModal.trim();
        }
        if (phoneNumberInModal !== null && phoneNumber !== '') {
            manufacturerBody['phoneNumber'] = phoneNumberInModal.trim();
        }
        console.log("manufacturer body: " + JSON.stringify(manufacturerBody));

        if (insertable) {
            postwithAuth(endpointAdmin + "/manufacturers", manufacturerBody).then((response) => {
                if (response.status === 200 || response.status === 201) {
                    console.log("Insert new manufacturer successfully!");

                    toast.success(messages.insertSuccess, {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 2000,
                    });

                    if (useExternal === false) {
                        setTimeout(function () {
                            window.location.replace(hostFrontend + "admin/manufacturers");
                        }, 2000);
                    }

                    getResultInModal(true);
                    toggle();
                }
            }).catch(error => {
                toast.error(messages.insertFailed + error.response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000,
                });
                console.log("error inserting new manufacturer: " + error);
                getResultInModal(false);
            })
        }
        else {
            putWithAuth(endpointAdmin + "/manufacturers/" + id, manufacturerBody).then((response) => {
                if (response.status === 200) {
                    console.log("Update manufacturer successfully!");

                    toast.success(messages.updateSuccess, {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 2000,
                    });

                    if (useExternal === false) {
                        setTimeout(function () {
                            window.location.replace(hostFrontend + "admin/manufacturers");
                        }, 2000);
                    }
                    getResultInModal(true);
                    toggle();
                }
            }).catch(error => {
                alert();
                toast.error(messages.updateFailed + error.response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000,
                });
                console.log("error updating manufacturer: " + error);
                getResultInModal(false);
            })
        }
    }

    const validateForm = (inp_name, inp_email, inp_address, inp_phoneNumber) => {
        let errors = {}, formIsValid = true;
        if (inp_name.length < 3 || inp_name.length > 50) {
            errors["name"] = messages.brand_ManufacturerNameLength;
            formIsValid = false;
        }
        else if (inp_address !== "" && (inp_address.length < 3 || inp_address.length > 50)) {
            errors["address"] = messages.addressLength;
            formIsValid = false;
        }
        else if (validator.isEmail(inp_email) === false) {
            errors["email"] = messages.invalidEmailFormat;
            formIsValid = false;
        }
        else if ((inp_phoneNumber !== "" && inp_phoneNumber !== null) && (inp_phoneNumber.length < 8 || inp_phoneNumber.length > 14)) {
            errors["phoneNumber"] = messages.phoneNumberLength;
            formIsValid = false;
        }
        else if ((inp_phoneNumber !== "" && inp_phoneNumber !== null) && !validator.isMobilePhone(inp_phoneNumber)) {
            errors["phoneNumber"] = messages.invalidPhoneNumberFormat;
            formIsValid = false;
        }
        setErrors(errors);

        return formIsValid;
    }

    const rendermanuFacturerIdField = () => {
        if (!props.insertable) {
            return (
                <FormGroup>
                    <Label for="manufacturerId">ID</Label>
                    <Input style={{ width: "20rem" }} type="text" name="manufacturerId" value={id} readOnly={true}
                        id="manufacturerId" placeholder="Enter manufacturer ID" onChange={e => setId(e.target.value)} />
                </FormGroup>
            );
        }
    }

    return (
        <div>
            <Button color={color} onClick={toggle}>{buttonLabel}</Button>
            <Modal isOpen={modal} toggle={toggle} className={className}>
                <ModalHeader toggle={toggle}>{title}</ModalHeader>
                <ModalBody>
                    <Form onSubmit={(e) => this.updateManufacturer(e)}>
                        {rendermanuFacturerIdField()}
                        <FormGroup>
                            <Label for="manufacturerName">Tên nhà sản xuất</Label>
                            <Input style={{ width: "20rem" }} type="manufacturerName" name="manufacturerName" value={name} required
                                id="manufacturerName" placeholder="Nhập tên nhà sản xuất" maxLength="50"
                                onChange={e => setName(e.target.value)} />
                            <span style={{ color: "red" }}>{errors["name"]}</span>
                        </FormGroup>
                        <FormGroup>
                            <Label for="email">Email</Label>
                            <Input style={{ width: "20rem" }} type="email" name="email" value={emailInModal} maxLength="50"
                                id="email" placeholder="Nhập email" onChange={e => setEmailInModal(e.target.value)} />
                            <span style={{ color: "red" }}>{errors["email"]}</span>
                        </FormGroup>
                        <FormGroup>
                            <Label for="address">Địa chỉ</Label>
                            <Input style={{ width: "20rem" }} type="address" name="address" value={addressInModal} maxLength="50"
                                id="address" placeholder="Nhập địa chỉ" onChange={e => setAddressInModal(e.target.value)} />
                            <span style={{ color: "red" }}>{errors["address"]}</span>
                        </FormGroup>
                        <FormGroup>
                            <Label for="phoneNumber">Số điện thoại</Label>
                            <Input style={{ width: "20rem" }} type="phoneNumber" name="phoneNumber" value={phoneNumberInModal} maxLength="14"
                                id="phoneNumber" placeholder="Nhập số điện thoại" onChange={e => setPhoneNumberInModal(e.target.value)} />
                            <span style={{ color: "red" }}>{errors["phoneNumber"]}</span>
                        </FormGroup>
                        <FormGroup>
                            <Label for="country">Quốc Gia</Label>
                            <Input style={{ width: "20rem" }} type="country" name="country" value={countryInModal} maxLength="10"
                                id="country" placeholder="Nhập quốc gia" onChange={e => setCountryInModal(e.target.value)} />
                            <span style={{ color: "red" }}>{errors["country"]}</span>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={updateManufacturer}>OK</Button>
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default ManufacturerModal;