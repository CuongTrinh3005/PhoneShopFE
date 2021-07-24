import React, { useState } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import { endpointUser, getWithAuth, postwithAuth, putWithAuth } from '../../components/HttpUtils';

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
    const toggle = () => setModal(!modal);

    const updateCategory = (e) => {
        e.preventDefault();
        toggle();

        if (validateForm(id, name) !== true)
            return;
        const categoryBody = { categoryId: id, categoryName: name, description: descript }

        if (insertable) {
            postwithAuth(endpointUser + "/categories", categoryBody).then((response) => {
                if (response.status === 200 || response.status === 201) {
                    console.log("Insert new category successfully!");
                    alert("Insert new category successfully!");
                    window.location.replace("http://localhost:3000/admin/categories");
                    getResultInModal(true);
                }
            }).catch(error => {
                alert("Insert new category failed!" + error.response.data.message);
                console.log("error inserting new category: " + error);
                getResultInModal(false);
            })
        }
        else {
            putWithAuth(endpointUser + "/categories/" + id, categoryBody).then((response) => {
                if (response.status === 200) {
                    console.log("Update category successfully!");
                    alert("Update category successfully!");
                    window.location.replace("http://localhost:3000/admin/categories");
                    getResultInModal(true);
                }
            }).catch(error => {
                alert("Update category failed!");
                console.log("error updating category: " + error);
                getResultInModal(false);
            })
        }
    }

    const validateForm = (inp_id, inp_name) => {
        if (inp_id === null || inp_id === '' || inp_name === null || inp_name === '') {
            alert("Do not let input empty!");
            return false;
        }
        else if (inp_id.length < 2 || inp_id.length > 8) {
            alert("Length of category id is in range of 2 to 8");
            return false;
        }
        else if (inp_name.length < 3 || inp_name.length > 40) {
            alert("Length of category name is in range of 3 to 40");
            return false;
        }

        return true;
    }

    return (
        <div>
            <Button color={color} onClick={toggle}>{buttonLabel}</Button>
            <Modal isOpen={modal} toggle={toggle} className={className}>
                <ModalHeader toggle={toggle}>{title}</ModalHeader>
                <ModalBody>
                    <Form onSubmit={(e) => this.updateCategory(e)}>
                        <FormGroup>
                            <Label for="categoryId">ID</Label>
                            <Input style={{ width: "20rem" }} type="text" name="categoryId" value={id}
                                id="categoryId" placeholder="Enter category ID" onChange={e => setId(e.target.value)} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="categoryName">Name</Label>
                            <Input style={{ width: "20rem" }} type="categoryName" name="categoryName" value={name}
                                id="categoryName" placeholder="Enter category name" onChange={e => setName(e.target.value)} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="description">Description</Label>
                            <Input style={{ width: "20rem" }} type="description" name="description" value={descript}
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