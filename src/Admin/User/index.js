import React, { useEffect, useState } from 'react';
import { deleteWithAuth, endpointUser, getWithAuth, hostBackend } from '../../components/HttpUtils';
import { Container, Row, Col } from 'reactstrap';
import Pagination from '../../components/Pagination';
import ModalForm from './UserModal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RiCloseCircleLine } from 'react-icons/ri'
import { useHistory } from 'react-router-dom';
import { messages } from '../../components/message';

toast.configure();
const UserManagement = ({ setDisplayAside }) => {
    const history = useHistory();
    const [userList, setUserList] = useState([]);
    const [roles, setRoles] = useState([]);
    const [result, setResult] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemPerPage] = useState(5);
    const [deleted, setDeleted] = useState(false);
    const [query, setQuery] = useState("");

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
        if (window.confirm(messages.deleteConfirm)) {
            deleteWithAuth(hostBackend + "api/v1/admin/users/" + username).then((response) => {
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
                    toast.success(messages.deleteSuccess, {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 1000,
                    });
                }
            }).catch(error => {
                if (error.response) {
                    toast.error(messages.deleteFailed + " Không được xóa user có đơn hàng hay đánh giá sản phẩm", {
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

    var currentList = [];
    if (query !== '') {
        currentList = userList.filter((user) => user['username'].toString().includes(query)
            || user['fullName'].toLowerCase().includes(query) || user['email'].toLowerCase().includes(query));
    }
    else {
        const indexOfLastItem = currentPage * itemPerPage;
        const indexOfFirstItem = indexOfLastItem - itemPerPage;
        currentList = userList.slice(indexOfFirstItem, indexOfLastItem);
    }

    const paginate = (pageNumber) => {
        try {
            if (deleted === true) {
                toast.info("Cập nhật dữ liệu sau xóa!", {
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

    const onSearching = (event) => {
        let query = event.target.value.toLowerCase().trim();
        setQuery(query);
    }

    return (
        <div>
            <Container>
                <Row style={{ marginTop: "2rem" }}>
                    <h3 className="alert alert-warning" align="center" style={{ width: "100%" }}>QUẢN LÝ NGƯỜI DÙNG</h3>
                    <Col sm="9" >
                        <input type="search"
                            style={{ width: "15rem" }} placeholder="Nhập username, họ tên, email..."
                            onChange={onSearching} />
                    </Col>
                    <Col >
                        <ModalForm style={{ marginTop: "1rem" }, { marginLeft: "7rem" }}
                            buttonLabel="Thêm mới người dùng"
                            className="insert-button"
                            title="Thêm mới người dùng"
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
                            Thêm mới người dùng</ModalForm>
                    </Col>
                </Row>

                <Row style={{ marginTop: "2rem" }}>
                    <Col>
                        <table className="table table-hover">
                            <thead>
                                <tr>
                                    <th>Username</th>
                                    <td>Ảnh</td>
                                    <th>Họ tên</th>
                                    <th>ROLE</th>
                                    <th>Email</th>
                                    <th>Giới tính</th>
                                    <th>SĐT</th>
                                    <th></th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody id="table-body">
                                {currentList.map((user) => (
                                    <tr key={user.username} id={"row-" + user.username}>
                                        <td>{user.username}</td>
                                        <td>
                                            {(user.photo !== null && user.photo !== undefined) ?
                                                <img src={`data:image/jpeg;base64,${user.photo}`}
                                                    alt="No image" height="50" width="100">
                                                </img>
                                                :
                                                <img src={window.location.origin + '/user-default.jpg'}
                                                    alt="No image" height="50" width="100">
                                                </img>
                                            }

                                        </td>
                                        <td>{user.fullName}</td>
                                        <td>{user.roles.trim().replace(" ", ", ")}</td>
                                        <td>{user.email}</td>
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
                                            <RiCloseCircleLine color="red" onClick={() => deleteUser(user.username)} />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </Col>
                    {query === '' && <Pagination itemPerPage={itemPerPage} totalItems={userList.length} paginate={paginate} />}
                </Row>
            </Container>
        </div>
    );
}

export default UserManagement;