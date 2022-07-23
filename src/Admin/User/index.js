import React, { useEffect, useState } from 'react';
import { deleteWithAuth, endpointAdmin, endpointUser, getWithAuth, hostBackend } from '../../components/HttpUtils';
import { Container, Row, Col } from 'reactstrap';
import Pagination from '../../components/Pagination';
import ModalForm from './UserModal';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { RiCloseCircleLine } from 'react-icons/ri'
import { messages } from '../../components/message';

toast.configure();
const UserManagement = () => {
    const [userList, setUserList] = useState([]);
    const [result, setResult] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemPerPage] = useState(40);
    const [deleted, setDeleted] = useState(false);
    const [query, setQuery] = useState("");

    const fetchAllUsers = () => {
        getWithAuth(endpointAdmin + "/users").then((response) => {
            if (response.status === 200) {
                setUserList(response.data);
            }
        }).catch((error) => console.log("Fetching users error: " + error))
    }

    useEffect(() => {
        fetchAllUsers();
    }, []);

    const getResultInModal = (resultModal) => {
        setResult(resultModal);
    }

    const deleteUser = (userId) => {
        if (window.confirm(messages.deleteConfirm)) {
            deleteWithAuth(endpointAdmin + "/users/" + userId).then((response) => {
                if (response.status === 200) {
                    setDeleted(true);
                    // remove in list locally
                    const index = userList.map(function (item) {
                        return item.userId
                    }).indexOf(userId);
                    userList.splice(index, 1);

                    // rerender DOM
                    var deletedRow = document.getElementById("row-" + userId);
                    document.getElementById("table-body").removeChild(deletedRow);

                    // document.getElementById("row-" + userId).remove();
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
        currentList = userList.filter((user) => user['userId'].toLowerCase().includes(query)
            || user['hollyName'].toLowerCase().includes(query)
            || user['lastName'].toLowerCase().includes(query)
            || user['firstName'].toLowerCase().includes(query)
            || user['birthday'].includes(query)
            || user['christenDate'].includes(query)
            || user['fatherName'].toLowerCase().includes(query)
            || user['motherName'].toLowerCase().includes(query)
            || user['familyCode'].toLowerCase().includes(query)
        );
    }
    else {
        const indexOfLastItem = currentPage * itemPerPage;
        const indexOfFirstItem = indexOfLastItem - itemPerPage;
        currentList = userList.slice(indexOfFirstItem, indexOfLastItem);
    }

    const paginate = (pageNumber) => {
        try {
            if (deleted === true) {
                toast.info(messages.updateAfterDeleted, {
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
        if (deleted === true) {
            toast.info(messages.updateAfterDeleted, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
            });

            setTimeout(function () {
                window.location.reload();
            }, 2000);
        }

        let query = event.target.value.toLowerCase().trim();
        setQuery(query);
    }

    return (
        <div>
            <Container>
                <Row style={{ marginTop: "2rem" }}>
                    <h3 className="alert alert-warning" align="center" style={{ width: "100%" }}>QUẢN LÝ NGƯỜI DÙNG</h3>
                    <Col sm="9" >
                        <p>Số lượng: {userList.length}</p>
                        <input type="search"
                            style={{ width: "30rem" }} placeholder="Nhập ID, tên thánh, họ tên, ngày sinh, rửa tội, mã gia đình..."
                            onChange={onSearching} />
                    </Col>
                    <Col >
                        <ModalForm style={{ marginTop: "1rem", marginLeft: "7rem" }}
                            buttonLabel="Thêm mới người dùng"
                            className="insert-button"
                            title="Thêm mới người dùng"
                            color="success"
                            userId=""
                            username=""
                            hollyName=""
                            lastName=""
                            firstName=""
                            emailInput=""
                            dadPhoneNumberInput=""
                            momPhoneNumberInput=""
                            addressInput=""
                            genderInput={null}
                            imageInput={null}
                            roleInput=""
                            birthday=""
                            startDate=""
                            christenDate=""
                            confirmationDate=""
                            endDate=""
                            familyCodeInput=""
                            getResultInModal={() => getResultInModal()}
                            insertable={true}
                            deleted={deleted}>
                            Thêm mới người dùng</ModalForm>
                    </Col>
                </Row>

                <div style={{ marginTop: "2rem" }}>
                    <table className="table table-hover table-light">
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên Thánh</th>
                                <td>Họ và tên đệm</td>
                                <th>Tên</th>
                                <th>Ngày sinh</th>
                                <th>Ngày rửa tội </th>
                                <th>Họ tên cha</th>
                                <th>Họ tên mẹ</th>
                                <th>Mã gia đình</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody id="table-body">
                            {currentList.map((user) => (
                                <tr key={user.userId} id={"row-" + user.userId}>
                                    <td>{user.userId}</td>
                                    <td>{user.hollyName}</td>
                                    <td>{user.lastName}</td>
                                    <td>{user.firstName}</td>
                                    <td>{user.birthday}</td>
                                    <td>{user.christenDate}</td>
                                    <td>{user.fatherName}</td>
                                    <td>{user.motherName}</td>
                                    <td>{user.familyCode}</td>
                                    <td><ModalForm
                                        buttonLabel="Sửa"
                                        className="edit"
                                        title="Sửa"
                                        color="info"
                                        userId={user.userId}
                                        username={user.username}
                                        fullname={user.fullName}
                                        emailInput={user.email}
                                        phoneNumberInput={user.phoneNumber}
                                        addressInput={user.address}
                                        genderInput={user.gender}
                                        imageInput={user.image}
                                        roleInput={user.roleName}
                                        birthday={user.birthday}
                                        getResultInModal={() => getResultInModal()}
                                        insertable={false}
                                        deleted={deleted}>
                                    </ModalForm></td>
                                    <td>
                                        <RiCloseCircleLine color="red" onClick={() => deleteUser(user.userId)} />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {(query === '' && userList.length > itemPerPage) && <Pagination itemPerPage={itemPerPage} totalItems={userList.length} paginate={paginate} />}
                </div>
            </Container>
        </div>
    );
}

export default UserManagement;