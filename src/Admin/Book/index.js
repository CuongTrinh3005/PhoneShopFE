import React, { useEffect, useState } from 'react';
import { endpointPublic, get, deleteWithAuth, endpointUser } from '../../components/HttpUtils';
import { Button, Container, Row, Col } from 'reactstrap';
import Pagination from '../../components/Pagination'; import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { formatter } from '../../components/Formatter';
import { RiCloseCircleLine } from 'react-icons/ri'
import { FaPen } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';

toast.configure();
const BookManagement = () => {
    const history = useHistory();
    const [bookList, setBookList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemPerPage] = useState(5);
    const [query, setQuery] = useState("");
    const [deleted, setDeleted] = useState(false);

    const fetchAllBookByAscedingOrder = () => {
        get(endpointPublic + "/books/ascending").then((response) => {
            if (response.status === 200) {
                setBookList(response.data);
                console.log("Books: ", response.data)
            }
        }).catch((error) => console.log("Fetching books error: " + error))
    }

    useEffect(() => {
        fetchAllBookByAscedingOrder();
    }, []);

    const viewDetailBook = (id) => {
        history.push(`/admin/book/detail/${id}`)
    }

    const createNewBook = () => {
        history.push(`/admin/book/new`)
    }

    const deleteBook = (id) => {
        if (window.confirm('Do you actually want to delete?')) {
            deleteWithAuth(endpointUser + "/books/" + id).then((response) => {
                if (response.status === 200) {
                    setDeleted(true);
                    // remove in list locally
                    const index = bookList.map(function (item) {
                        return item.bookId
                    }).indexOf(id);
                    bookList.splice(index, 1);

                    // rerender DOM
                    document.getElementById("row-" + id).remove();
                    toast.success("Delete book successfully!", {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 1000,
                    });
                }
            }).catch(error => {
                if (error.response) {
                    toast.error("Delete book failed! Can not book having ratings or orders", {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 1000,
                    });
                }
                console.log("Delete book error: " + error);
            })
        } else {
            // Do nothing!
        }
    }

    // Searching first
    var currentList = [];
    if (query !== '') {
        currentList = bookList.filter((book) => book['bookId'].toString().includes(query)
            || book['bookName'].toLowerCase().includes(query) || book['categoryName'].toLowerCase().includes(query)
        );
    }
    else {
        const indexOfLastItem = currentPage * itemPerPage;
        const indexOfFirstItem = indexOfLastItem - itemPerPage;
        currentList = bookList.slice(indexOfFirstItem, indexOfLastItem);
    }

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

    const onSearching = (event) => {
        let query = event.target.value.toLowerCase().trim();
        setQuery(query);
    }

    return (
        <Container >
            <Row style={{ marginTop: "2rem" }}>
                <h3 className="alert alert-info" align="center">QUẢN LÝ SÁCH</h3>
                <Col sm="9" >
                    <input type="search"
                        style={{ width: "16rem" }} placeholder="Nhập tên sách, mã sách, thể loại..."
                        onChange={onSearching} />
                </Col>
                <Col>
                    <Button style={{ float: "right" }} color="success" onClick={createNewBook}>
                        THÊM MỚI SÁCH
                    </Button>
                </Col>
            </Row>

            <Row style={{ marginTop: "2rem" }}>
                <Col >
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Tên sách</th>
                                <th>Đơn giá</th>
                                <th>Số lượng</th>
                                <th>Giảm giá</th>
                                <th>Thể loại</th>
                                <th>Nhà xuất bản</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentList.map((book) => (
                                <tr key={book.bookId} id={"row-" + book.bookId}>
                                    <td>{book.bookId}</td>
                                    <td>{book.bookName}</td>
                                    <td>{formatter.format(book.unitPrice)}</td>
                                    <td>{book.quantity}</td>
                                    <td>{book.discount * 100}%</td>
                                    <td>{book.categoryName}</td>
                                    <td>{book.publisherName}</td>
                                    <td><FaPen onClick={() => viewDetailBook(book.bookId)} /></td>
                                    <td><RiCloseCircleLine color="red" onClick={() => deleteBook(book.bookId)} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Col>
                {query === '' && <Pagination itemPerPage={itemPerPage} totalItems={bookList.length} paginate={paginate} />}
            </Row>
        </Container>
    );
}

export default BookManagement;