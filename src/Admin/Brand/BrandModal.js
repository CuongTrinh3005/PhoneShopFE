import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import { endpointAdmin, endpointUser, hostFrontend, postwithAuth, putWithAuth } from '../../components/HttpUtils';
import validator from 'validator';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { messages } from '../../components/message';

toast.configure();
const BrandModal = (props) => {
    const {
        buttonLabel,
        className,
        title,
        color,
        brandId,
        brandName,
        country,
        description,
        getResultInModal,
        insertable,
        external
    } = props;

    const [id, setId] = useState(brandId)
    const [name, setName] = useState(brandName)
    const [countryInModal, setCountryInModal] = useState(country)
    const [descriptionInModal, setDescriptionInModal] = useState(description)
    const [useExternal] = useState(external);

    const [modal, setModal] = useState(false);
    const [errors, setErrors] = useState({});

    const toggle = () => setModal(!modal);

    const updateBrand = (e) => {
        e.preventDefault();
        // toggle();

        if (!validateForm(id, name, countryInModal))
            return;
        const brandBody = { brandId: id, brandName: name.trim(), country: countryInModal, description: descriptionInModal }
        if (countryInModal !== null && countryInModal !== '') {
            brandBody['country'] = countryInModal.trim();
        }
        if (descriptionInModal !== null && description !== '') {
            brandBody['description'] = descriptionInModal.trim();
        }

        console.log("brand body: " + JSON.stringify(brandBody));

        if (insertable) {
            postwithAuth(endpointAdmin + "/brands", brandBody).then((response) => {
                if (response.status === 200 || response.status === 201) {
                    console.log("Insert new brand successfully!");
                    toast.success(messages.insertSuccess, {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 2000,
                    });

                    if (useExternal === false) {
                        setTimeout(function () {
                            window.location.replace(hostFrontend + "admin/brands");
                        }, 2000);
                    }

                    getResultInModal(true);
                    toggle();
                }
            }).catch(error => {
                toast.error(messages.insertFailed + " Vui lòng kiểm tra đường truyền!", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000,
                });
                console.log("error inserting new brand: " + error);
                getResultInModal(false);
            })
        }
        else {
            putWithAuth(endpointAdmin + "/brands/" + id, brandBody).then((response) => {
                if (response.status === 200) {
                    console.log("Update brand successfully!");

                    toast.success(messages.updateSuccess, {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 2000,
                    });

                    if (useExternal === false) {
                        setTimeout(function () {
                            window.location.replace(hostFrontend + "admin/brands");
                        }, 2000);
                    }

                    getResultInModal(true);
                    toggle();
                }
            }).catch(error => {
                toast.error(messages.insertFailed + " Vui lòng kiểm tra đường truyền!", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000,
                });
                console.log("error updating brand: " + error);
                getResultInModal(false);
            })
        }
    }

    const validateForm = (inp_id, inp_name, inp_country) => {
        let errors = {}, formIsValid = true;
        if (inp_id.length < 3 || inp_id.length > 8) {
            errors["id"] = messages.categoryIdLength;
            formIsValid = false;
        }
        if (inp_name.length < 3 || inp_name.length > 50) {
            errors["name"] = messages.brand_ManufacturerNameLength;
            formIsValid = false;
        }
        else if (inp_country !== "" && (inp_country.length < 2 || inp_country.length > 10)) {
            errors["country"] = messages.countryLength;
            formIsValid = false;
        }

        setErrors(errors);

        return formIsValid;
    }

    const renderBrandIdField = () => {
        if (!props.insertable) {
            return (
                <FormGroup>
                    <Label for="brandId">ID</Label>
                    <Input style={{ width: "20rem" }} type="text" name="brandId" value={id} readOnly={true}
                        id="brandId" placeholder="Enter brand ID" onChange={e => setId(e.target.value)} />
                </FormGroup>
            );
        }
        else {
            return (
                <FormGroup>
                    <Label for="brandId">ID</Label>
                    <Input style={{ width: "20rem" }} type="text" name="brandId" value={id}
                        id="brandId" placeholder="Enter brand ID" onChange={e => setId(e.target.value)} />
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
                    <Form onSubmit={(e) => this.updateBrand(e)}>
                        {renderBrandIdField()}
                        <span style={{ color: "red" }}>{errors["id"]}</span>
                        <FormGroup>
                            <Label for="brandName">Tên thương hiệu</Label>
                            <Input style={{ width: "20rem" }} type="brandName" name="brandName" value={name} required
                                id="brandName" placeholder="Nhập tên thương hiệu" maxLength="50"
                                onChange={e => setName(e.target.value)} />
                            <span style={{ color: "red" }}>{errors["name"]}</span>
                        </FormGroup>
                        <FormGroup>
                            <Label for="country">Quốc Gia</Label>
                            <Input style={{ width: "20rem" }} type="country" name="country" value={countryInModal} maxLength="50"
                                id="country" placeholder="Nhập quốc gia" onChange={e => setCountryInModal(e.target.value)} />
                            <span style={{ color: "red" }}>{errors["country"]}</span>
                        </FormGroup>
                        <FormGroup>
                            <Label for="description">Mô tả</Label>
                            <Input style={{ width: "20rem" }} type="description" name="description" value={descriptionInModal} maxLength="50"
                                id="description" placeholder="Nhập mô tả" onChange={e => setDescriptionInModal(e.target.value)} />
                            <span style={{ color: "red" }}>{errors["description"]}</span>
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={updateBrand}>OK</Button>
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default BrandModal;