import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import { endpointAdmin, hostFrontend, postwithAuth, putWithAuth } from '../../components/HttpUtils';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { messages } from '../../components/message';

toast.configure();
const CateModal = (props) => {
    const {
        buttonLabel,
        className,
        title,
        color,
        categoryId,
        categoryName,
        description,
        getResultInModal,
        insertable,
        external
    } = props;

    const [id, setId] = useState(categoryId)
    const [name, setName] = useState(categoryName)
    const [descript, setDescript] = useState(description)
    const [useExternal] = useState(external)

    const [modal, setModal] = useState(false);
    const [errors, setErrors] = useState({});

    const toggle = () => setModal(!modal);

    const updateCategory = (e) => {
        e.preventDefault();

        if (validateForm(id, name) !== true)
            return;
        const categoryBody = { categoryId: id, categoryName: name, description: descript }
        if (id !== null && id !== '') {
            categoryBody['categoryId'] = id.trim();
        }
        if (name !== null && name !== '') {
            categoryBody['categoryName'] = name.trim();
        }
        if (descript !== null && descript !== '') {
            categoryBody['description'] = descript.trim();
        }

        if (insertable) {
            postwithAuth(endpointAdmin + "/categories", categoryBody).then((response) => {
                if (response.status === 200 || response.status === 201) {
                    toast.success(messages.insertSuccess, {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 2000,
                    });

                    if (useExternal === false) {
                        setTimeout(function () {
                            window.location.replace(hostFrontend + "admin/categories");
                        }, 2000);
                    }

                    getResultInModal(true);
                    toggle();
                }
            }).catch(error => {
                console.log("error inserting new category: " + error);
                toast.error(messages.insertFailed, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000,
                });
                getResultInModal(false);
            })
        }
        else {
            putWithAuth(endpointAdmin + "/categories/" + id, categoryBody).then((response) => {
                if (response.status === 200) {
                    toast.success(messages.updateSuccess, {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 2000,
                    });

                    if (useExternal === false) {
                        setTimeout(function () {
                            window.location.replace(hostFrontend + "admin/categories");
                        }, 2000);
                    }

                    getResultInModal(true);
                    toggle();
                }
            }).catch(error => {
                toast.error(messages.updateFailed + error.response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000,
                });
                getResultInModal(false);
            })
        }
    }

    const validateForm = (inp_id, inp_name) => {
        let errors = {}, formIsValid = true;
        if (inp_id.length < 3 || inp_id.length > 8) {
            errors["id"] = messages.categoryIdLength;
            formIsValid = false;
        }
        else if (inp_name.length < 3 || inp_name.length > 40) {
            errors["name"] = messages.categoryNameLength;
            formIsValid = false;
        }
        setErrors(errors);

        return formIsValid;
    }

    const renderCategoryIdField = () => {
        if (props.insertable) {
            return (
                <FormGroup>
                    <Label for="categoryId">Mã loại sản phẩm</Label>
                    <Input style={{ width: "20rem" }} type="text" name="categoryId" value={id} required maxLength="8"
                        id="categoryId" placeholder="Nhập mã loại sản phẩm" onChange={e => setId(e.target.value)} />
                    <span style={{ color: "red" }}>{errors["id"]}</span>
                </FormGroup>
            );
        }
        return (
            <FormGroup>
                <Label for="categoryId">Mã loại sản phẩm</Label>
                <Input style={{ width: "20rem" }} type="text" name="categoryId" value={id} readOnly="true"
                    id="categoryId" placeholder="Nhập mã loại sản phẩm" onChange={e => setId(e.target.value)} />
            </FormGroup>
        );

    }

    return (
        <div>
            <Button color={color} onClick={toggle}>{buttonLabel}</Button>
            <Modal isOpen={modal} toggle={toggle} className={className}>
                <ModalHeader toggle={toggle}>{title}</ModalHeader>
                <ModalBody>
                    <Form onSubmit={(e) => this.updateCategory(e)}>
                        {renderCategoryIdField()}
                        <FormGroup>
                            <Label for="categoryName">Tên loại sản phẩm</Label>
                            <Input style={{ width: "20rem" }} type="categoryName" name="categoryName" value={name} required maxLength="40"
                                id="categoryName" placeholder="Nhập tên loại sản phẩm" onChange={e => setName(e.target.value)} />
                            <span style={{ color: "red" }}>{errors["name"]}</span>
                        </FormGroup>
                        <FormGroup>
                            <Label for="description">Mô tả</Label>
                            <Input style={{ width: "20rem" }} type="description" name="description" value={descript} maxLength="50"
                                id="description" placeholder="Nhập mô tả" onChange={e => setDescript(e.target.value)} />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={updateCategory}>OK</Button>
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default CateModal;