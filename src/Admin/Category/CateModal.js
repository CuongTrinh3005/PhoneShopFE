import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import { endpointUser, postwithAuth, putWithAuth } from '../../components/HttpUtils';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();
const ModalForm = (props) => {
    const {
        buttonLabel,
        className,
        title,
        color,
        categoryId,
        categoryName,
        description,
        getResultInModal,
        insertable
    } = props;

    const [id, setId] = useState(categoryId)
    const [name, setName] = useState(categoryName)
    const [descript, setDescript] = useState(description)

    const [modal, setModal] = useState(false);
    const [errors, setErrors] = useState({});

    const toggle = () => setModal(!modal);

    const updateCategory = (e) => {
        e.preventDefault();
        // toggle();

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
            postwithAuth(endpointUser + "/categories", categoryBody).then((response) => {
                if (response.status === 200 || response.status === 201) {
                    console.log("Insert new category successfully!");

                    toast.success("Insert new category successfully!", {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 2000,
                    });

                    setTimeout(function () {
                        window.location.replace("http://localhost:3000/admin/categories");
                    }, 2000);
                    getResultInModal(true);
                }
            }).catch(error => {
                console.log("error inserting new category: " + error);
                toast.error("Insert new category failed! " + error.response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000,
                });
                getResultInModal(false);
            })
        }
        else {
            putWithAuth(endpointUser + "/categories/" + id, categoryBody).then((response) => {
                if (response.status === 200) {
                    console.log("Update category successfully!");

                    toast.success("Update category successfully!", {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 2000,
                    });

                    setTimeout(function () {
                        window.location.replace("http://localhost:3000/admin/categories");
                    }, 2000);
                    getResultInModal(true);
                }
            }).catch(error => {
                toast.error("Update category failed!" + error.response.data.message, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000,
                });
                console.log("error updating category: " + error);
                getResultInModal(false);
            })
        }
    }

    const validateForm = (inp_id, inp_name) => {
        let errors = {}, formIsValid = true;
        if (inp_id.length < 2 || inp_id.length > 8) {
            errors["id"] = "Length of category id is in range of 2 to 8";
            formIsValid = false;
        }
        else if (inp_name.length < 3 || inp_name.length > 40) {
            errors["name"] = "Length of category name is in range of 3 to 40";
            formIsValid = false;
        }
        setErrors(errors);

        return formIsValid;
    }

    const renderCategoryIdField = () => {
        if (props.insertable) {
            return (
                <FormGroup>
                    <Label for="categoryId">ID</Label>
                    <Input style={{ width: "20rem" }} type="text" name="categoryId" value={id} required maxLength="8"
                        id="categoryId" placeholder="Enter category ID" onChange={e => setId(e.target.value)} />
                    <span style={{ color: "red" }}>{errors["id"]}</span>
                </FormGroup>
            );
        }
        return (
            <FormGroup>
                <Label for="categoryId">ID</Label>
                <Input style={{ width: "20rem" }} type="text" name="categoryId" value={id} readOnly="true"
                    id="categoryId" placeholder="Enter category ID" onChange={e => setId(e.target.value)} />
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
                            <Label for="categoryName">Name</Label>
                            <Input style={{ width: "20rem" }} type="categoryName" name="categoryName" value={name} required maxLength="40"
                                id="categoryName" placeholder="Enter category name" onChange={e => setName(e.target.value)} />
                            <span style={{ color: "red" }}>{errors["name"]}</span>
                        </FormGroup>
                        <FormGroup>
                            <Label for="description">Description</Label>
                            <Input style={{ width: "20rem" }} type="description" name="description" value={descript} maxLength="50"
                                id="description" placeholder="Enter description" onChange={e => setDescript(e.target.value)} />
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

export default ModalForm;