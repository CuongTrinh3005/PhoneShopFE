import React, { useEffect, useState } from 'react';
import { endpointPublic, get, deleteWithAuth, endpointUser } from '../../components/HttpUtils';
import { Button, Container, Row, Col } from 'reactstrap';
import Pagination from '../../components/Pagination'; import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

toast.configure();
const BookManagement = () => {
    const [bookList, setBookList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemPerPage] = useState(5);
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
        window.location.replace("http://localhost:3000/admin/book/detail/" + id)
    }

    const createNewBook = () => {
        window.location.replace("http://localhost:3000/admin/book/new")
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

    const indexOfLastItem = currentPage * itemPerPage;
    const indexOfFirstItem = indexOfLastItem - itemPerPage;
    const currentList = bookList.slice(indexOfFirstItem, indexOfLastItem);

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
        <Container >
            <Row style={{ marginTop: "2rem" }}>
                <h3 className="alert alert-info" align="center">Book Management</h3>
                <Col sm="9" > </Col>
                <Col>
                    <Button style={{ marginTop: "1rem" }, { marginLeft: "2rem" }} color="success" onClick={createNewBook}>
                        ADD NEW BOOK
                    </Button>
                </Col>
            </Row>

            <Row style={{ marginTop: "2rem" }}>
                <Col >
                    <table >
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Discount</th>
                                <th>Description</th>
                                <th>Category</th>
                                <th>Publisher</th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentList.map((book) => (
                                <tr key={book.bookId} id={"row-" + book.bookId}>
                                    <td>{book.bookId}</td>
                                    <td>{book.bookName}</td>
                                    <td>{book.unitPrice}</td>
                                    <td>{book.quantity}</td>
                                    <td>{book.discount}</td>
                                    <td>{book.description}</td>
                                    <td>{book.categoryName}</td>
                                    <td>{book.publisherName}</td>
                                    <td><Button color="info" onClick={() => viewDetailBook(book.bookId)}>Detail</Button></td>
                                    <td><Button color="danger" onClick={() => deleteBook(book.bookId)}>Delete</Button></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Col>
                <Pagination itemPerPage={itemPerPage} totalItems={bookList.length} paginate={paginate} />
            </Row>
        </Container>
    );
}

export default BookManagement;