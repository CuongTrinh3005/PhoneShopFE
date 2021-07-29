import React, { Component } from 'react';
import { deleteWithAuth, endpointUser, getWithAuth } from '../../components/HttpUtils';
import { Button, Container, Row, Col } from 'reactstrap';
import ModalForm from './UserModal';

class UserManagement extends Component {
    state = { userList: [], roles: [], categoryList: [], result: false }

    fetchAllUsers() {
        getWithAuth(endpointUser + "/admin/users").then((response) => {
            if (response.status === 200) {
                this.setState({ userList: response.data })
                this.setState({ roles: response.data.roles })
            }
        }).catch((error) => console.log("Fetching users error: " + error))
    }

    componentDidMount() {
        this.fetchAllUsers();
    }

    // displayRoleNames(RoleArr) {
    //     let roleNames = "";
    //     for (let index = 0; index < RoleArr.length; index++) {
    //         roleNames += RoleArr[index].roleName;
    //         console.log("Role Loop: " + roleNames)
    //         if (index < RoleArr.length - 1)
    //             roleNames += ', '
    //     }
    //     return roleNames;
    // }

    getResultInModal = (resultModal) => {
        this.setState({ result: resultModal })
    }

    deleteUser(username) {
        if (window.confirm('Do you actually want to delete?')) {
            deleteWithAuth("http://localhost:9081/api/v1/admin/users/" + username).then((response) => {
                if (response.status === 200) {
                    alert("Delete user successfully!");
                    this.fetchAllUsers();
                }
            }).catch(error => {
                if (error.response) {
                    alert(error.response.data.message)
                    console.log(error.response.data);
                    console.log(error.response.status);
                    console.log(error.response.headers);
                }
                console.log("Delete user error: " + error);
            })
        } else {
            // Do nothing!
        }
    }

    render() {
        return (
            <Container className="cate-style">
                <Row style={{ marginTop: "8rem" }}>
                    <h3>User Management</h3>
                    <Col sm="9"></Col>

                    <Col >
                        <ModalForm
                            buttonLabel="ADD NEW USER"
                            className="insert-button"
                            title="Add new user"
                            color="success"
                            username=""
                            fullname=""
                            emailInput=""
                            phoneNumberInput=""
                            addressInput=""
                            genderInput=""
                            imageInput=""
                            roleInput=""
                            getResultInModal={() => this.getResultInModal()}
                            insertable={true}>
                            Add new category</ModalForm>
                    </Col>
                </Row>

                <Row>
                    <table>
                        <thead>
                            <tr>
                                <th>Username</th>
                                {/* <td>Avatar</td> */}
                                <th>Fullname</th>
                                <th>ROLE</th>
                                <th>Email</th>
                                <th>Address</th>
                                <th>Gender</th>
                                <th>Phone Number</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.userList.map((user, index) => (
                                <tr key={user.username}>
                                    <td>{user.username}</td>
                                    {/* <td>
                                        <img src={`data:image/jpeg;base64,${user.photo}`}
                                            alt="No image" height="50" width="100">
                                        </img>
                                    </td> */}
                                    <td>{user.fullName}</td>
                                    <td>{user.roles.trim().replace(" ", ", ")}</td>
                                    <td>{user.email}</td>
                                    <td>{user.address}</td>
                                    {user.gender ? <td>MALE</td> : <td>MALE</td>}
                                    <td>{user.phoneNumber}</td>
                                    <td><ModalForm
                                        buttonLabel="EDIT"
                                        className="edit"
                                        title="Edit"
                                        color="info"
                                        username={user.username}
                                        fullname={user.fullName}
                                        emailInput={user.email}
                                        phoneNumberInput={user.phoneNumber}
                                        addressInput={user.address}
                                        genderInput={user.gender}
                                        imageInput={user.photo}
                                        roleInput={user.roles}
                                        getResultInModal={() => this.getResultInModal()}
                                        insertable={false}>
                                    </ModalForm></td>
                                    <td>
                                        <Button color="danger"
                                            onClick={() => this.deleteUser(user.username)}>
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Row>

            </Container>
        );
    }
}

export default UserManagement;