import React, { useEffect, useState } from 'react';
import { deleteWithAuth, endpointUser, getWithAuth } from '../../components/HttpUtils';
import { Button, Container, Row, Col } from 'reactstrap';
import Pagination from '../../components/Pagination';
import ModalForm from './UserModal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();
const UserManagement = ({ setDisplayAside }) => {
    const [userList, setUserList] = useState([]);
    const [roles, setRoles] = useState([]);
    const [result, setResult] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemPerPage] = useState(5);
    const [deleted, setDeleted] = useState(false);

    const fetchAllUsers = () => {
        getWithAuth(endpointUser + "/admin/users").then((response) => {
            if (response.status === 200) {
                setUserList(response.data);
                setRoles(response.data.roles);
            }
        }).catch((error) => console.log("Fetching users error: " + error))
    }

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const getResultInModal = (resultModal) => {
        setResult(resultModal);
    }

    const deleteUser = (username) => {
        if (window.confirm('Do you actually want to delete?')) {
            deleteWithAuth("http://localhost:9081/api/v1/admin/users/" + username).then((response) => {
                if (response.status === 200) {
                    setDeleted(true);
                    // remove in list locally
                    const index = userList.map(function (item) {
                        return item.username
                    }).indexOf(username);
                    userList.splice(index, 1);

                    // rerender DOM
                    var deletedRow = document.getElementById("row-" + username);
                    document.getElementById("table-body").removeChild(deletedRow);

                    // document.getElementById("row-" + username).remove();
                    toast.success("Delete user successfully!", {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 1000,
                    });
                }
            }).catch(error => {
                if (error.response) {
                    toast.error("Delete user failed! Can not user having ratings or orders!", {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 1000,
                    });
                }
                console.log("Delete user error: " + error);
            })
        } else {
            // Do nothing!
        }
    }

    const indexOfLastItem = currentPage * itemPerPage;
    const indexOfFirstItem = indexOfLastItem - itemPerPage;
    const currentList = userList.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => {
        try {
            if (deleted === true) {
                toast.info("Update data after deleting!", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000,
                });

                setTimeout(function () {
                    window.location.reload();
                }, 2000);
            }
            setCurrentPage(pageNumber)
        }
        catch (error) {
            console.log("Pagination error: " + error);
        }
    }

    return (
        <div>
            <h3 className="alert alert-warning" align="left" style={{ width: "100%" }}>User Management</h3>
            <Container>
                <Row>
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
                            genderInput={null}
                            imageInput=""
                            roleInput=""
                            getResultInModal={() => getResultInModal()}
                            insertable={true}>
                            Add new category</ModalForm>
                    </Col>
                </Row>

                <Row>
                    <table>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <td>Avatar</td>
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
                        <tbody id="table-body">
                            {currentList.map((user) => (
                                <tr key={user.username} id={"row-" + user.username}>
                                    <td>{user.username}</td>
                                    <td>
                                        <img src={`data:image/jpeg;base64,${user.photo}`}
                                            alt="No image" height="50" width="100">
                                        </img>
                                    </td>
                                    <td>{user.fullName}</td>
                                    <td>{user.roles.trim().replace(" ", ", ")}</td>
                                    <td>{user.email}</td>
                                    <td>{user.address}</td>
                                    {user.gender === null ? <td></td> : user.gender === true ? <td>MALE</td> : <td>FEMALE</td>}
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
                                        getResultInModal={() => getResultInModal()}
                                        insertable={false}>
                                    </ModalForm></td>
                                    <td>
                                        <Button color="danger"
                                            onClick={() => deleteUser(user.username)}>
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Row>
            </Container>
            <Pagination itemPerPage={itemPerPage} totalItems={userList.length} paginate={paginate} />
        </div>
    );
}

export default UserManagement;