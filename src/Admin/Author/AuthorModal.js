import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import { endpointUser, postwithAuth, putWithAuth } from '../../components/HttpUtils';
import validator from 'validator';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();
const ModalForm = (props) => {
    const {
        buttonLabel,
        className,
        title,
        color,
        authorId,
        authorName,
        address,
        phoneNumber,
        getResultInModal,
        insertable
    } = props;

    const [id, setId] = useState(authorId)
    const [name, setName] = useState(authorName)
    const [addressInModal, setAddressInModal] = useState(address)
    const [phoneNumberInModal, setPhoneNumberInModal] = useState(phoneNumber)

    const [modal, setModal] = useState(false);
    const [errors, setErrors] = useState({});

    const toggle = () => setModal(!modal);

    const updateAuthor = (e) => {
        e.preventDefault();
        // toggle();

        if (!validateForm(name, addressInModal, phoneNumberInModal))
            return;
        const authorBody = { authorId: id, authorName: name.trim(), address: addressInModal, phoneNumber: phoneNumberInModal }
        if (addressInModal !== null && addressInModal !== '') {
            authorBody['address'] = addressInModal.trim();
        }
        if (phoneNumberInModal !== null && phoneNumber !== '') {
            authorBody['phoneNumber'] = phoneNumberInModal.trim();
        }

        console.log("Author body: " + JSON.stringify(authorBody));

        if (insertable) {
            postwithAuth(endpointUser + "/authors", authorBody).then((response) => {
                if (response.status === 200 || response.status === 201) {
                    console.log("Insert new author successfully!");
                    toast.success("Insert new author successfully!", {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 2000,
                    });

                    setTimeout(function () {
                        window.location.replace("http://localhost:3000/admin/authors");
                    }, 2000);
                    getResultInModal(true);
                }
            }).catch(error => {
                toast.error("Insert new author failed! Please check your input or connection!", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000,
                });
                console.log("error inserting new author: " + error);
                getResultInModal(false);
            })
        }
        else {
            putWithAuth(endpointUser + "/authors/" + id, authorBody).then((response) => {
                if (response.status === 200) {
                    console.log("Update author successfully!");

                    toast.success("Update author successfully!", {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 2000,
                    });

                    setTimeout(function () {
                        window.location.replace("http://localhost:3000/admin/authors");
                    }, 2000);

                    getResultInModal(true);
                }
            }).catch(error => {
                toast.error("Update author failed! Please check your input or connection!", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000,
                });
                console.log("error updating author: " + error);
                getResultInModal(false);
            })
        }
    }

    const validateForm = (inp_name, inp_address, inp_phoneNumber) => {
        let errors = {}, formIsValid = true;
        if (inp_name.length < 5 || inp_name.length > 50) {
            errors["name"] = "Length of author name is in range of 5 to 50";
            formIsValid = false;
        }
        else if (inp_address !== "" && (inp_address.length < 5 || inp_address.length > 50)) {
            errors["address"] = "Length of author address is in range of 5 to 50";
            formIsValid = false;
        }
        else if ((inp_phoneNumber !== "" && inp_phoneNumber !== null) && (inp_phoneNumber.length < 8 || inp_phoneNumber.length > 14)) {
            errors["phoneNumber"] = "Length of phone number is in range of 8 to 14";
            formIsValid = false;
        }
        else if ((inp_phoneNumber !== "" && inp_phoneNumber !== null) && !validator.isMobilePhone(inp_phoneNumber)) {
            errors["phoneNumber"] = "Invalid phone number format!";
            formIsValid = false;
        }
        setErrors(errors);

        return formIsValid;
    }

    const renderAuthorIdField = () => {
        if (!props.insertable) {
            return (
                <FormGroup>
                    <Label for="authorId">ID</Label>
                    <Input style={{ width: "20rem" }} type="text" name="authorId" value={id} readOnly={true}
                        id="authorId" placeholder="Enter author ID" onChange={e => setId(e.target.value)} />
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
                    <Form onSubmit={(e) => this.updateAuthor(e)}>
                        {renderAuthorIdField()}
                        <FormGroup>
                            <Label for="authorName">Name</Label>
                            <Input style={{ width: "20rem" }} type="authorName" name="authorName" value={name} required
                                id="authorName" placeholder="Enter author name" maxLength="50"
                                onChange={e => setName(e.target.value)} />
                            <span style={{ color: "red" }}>{errors["name"]}</span>
                        </FormGroup>
                        <FormGroup>
                            <Label for="address">Address</Label>
                            <Input style={{ width: "20rem" }} type="address" name="address" value={addressInModal} maxLength="50"
                                id="address" placeholder="Enter address" onChange={e => setAddressInModal(e.target.value)} />
                            <span style={{ color: "red" }}>{errors["address"]}</span>
                        </FormGroup>
                        <FormGroup>
                            <Label for="phoneNumber">Phone Number</Label>
                            <Input style={{ width: "20rem" }} type="phoneNumber" name="phoneNumber" value={phoneNumberInModal} maxLength="14"
                                id="phoneNumber" placeholder="Enter phoneNumber" onChange={e => setPhoneNumberInModal(e.target.value)} />
                            <span style={{ color: "red" }}>{errors["phoneNumber"]}</span>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={updateAuthor}>OK</Button>
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default ModalForm;