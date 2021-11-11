import React, { useEffect, useState } from 'react';
import { endpointPublic, get, deleteWithAuth, endpointUser, endpointAdmin } from '../../components/HttpUtils';
import { Button, Container, Row, Col } from 'reactstrap';
import Pagination from '../../components/Pagination'; import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { formatter } from '../../components/Formatter';
import { RiCloseCircleLine } from 'react-icons/ri'
import { FaPen } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import { messages } from '../../components/message';
import PopupAccessories from './PopupAccessories';

toast.configure();
const ProductManagement = () => {
    const history = useHistory();
    const [productList, setProductList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemPerPage] = useState(40);
    const [query, setQuery] = useState("");
    const [deleted, setDeleted] = useState(false);

    const fetchAllProducts = () => {
        get(endpointPublic + "/products").then((response) => {
            if (response.status === 200) {
                setProductList(response.data);
            }
        }).catch((error) => console.log("Fetching products error: " + error))
    }

    useEffect(() => {
        fetchAllProducts();
    }, []);

    const viewDetailproduct = (id) => {
        history.push(`/admin/product/detail/${id}`)
    }

    const createNewProduct = () => {
        history.push(`/admin/product/new`)
    }

    const deleteProduct = (id) => {
        if (window.confirm(messages.deleteConfirm)) {
            deleteWithAuth(endpointAdmin + "/products/" + id).then((response) => {
                if (response.status === 200) {
                    setDeleted(true);
                    // remove in list locally
                    const index = productList.map(function (item) {
                        return item.productId
                    }).indexOf(id);
                    productList.splice(index, 1);

                    // rerender DOM
                    document.getElementById("row-" + id).remove();
                    toast.success(messages.deleteSuccess, {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 1000,
                    });
                }
            }).catch(error => {
                if (error.response) {
                    toast.error(messages.deleteFailed + " Không xóa sản phẩm có đánh giá hoặc hóa đơn", {
                        position: toast.POSITION.TOP_CENTER,
                        autoClose: 1000,
                    });
                }
                console.log("Delete product error: " + error);
            })
        } else {
            // Do nothing!
        }
    }

    // Searching first
    var currentList = [];
    if (query !== '') {
        currentList = productList.filter((product) => product['productId'].toLowerCase().includes(query)
            || product['productName'].toLowerCase().includes(query) || product['categoryName'].toLowerCase().includes(query)
        );
    }
    else {
        const indexOfLastItem = currentPage * itemPerPage;
        const indexOfFirstItem = indexOfLastItem - itemPerPage;
        currentList = productList.slice(indexOfFirstItem, indexOfLastItem);
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
        <Container >
            <Row style={{ marginTop: "2rem" }}>
                <h3 className="alert alert-info" align="center">QUẢN LÝ SẢN PHẨM</h3>
                <Col sm="9" >
                    <p>Số lượng: {productList.length}</p>
                    <input type="search"
                        style={{ width: "16rem" }} placeholder="Nhập mã, tên hay loại sản phẩm..."
                        onChange={onSearching} />
                </Col>
                <Col>
                    <Button style={{ float: "right" }} color="success" onClick={createNewProduct}>
                        THÊM MỚI SẢN PHẨM
                    </Button>
                </Col>
            </Row>

            <Row style={{ marginTop: "2rem" }}>
                <Col >
                    <table className="table table-hover">
                        <thead>
                            <tr>
                                <th>Mã sản phẩm</th>
                                <th>Tên sản phẩm</th>
                                <th>Đơn giá</th>
                                <th>Số lượng</th>
                                <th>Giảm giá</th>
                                <th>Loại sản phẩm</th>
                                <th>Nhà sản xuất</th>
                                <th></th>
                                <th></th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentList.map((product) => (
                                <tr key={product.productId} id={"row-" + product.productId}>
                                    <td>{product.productId}</td>
                                    <td>{product.productName}</td>
                                    <td>{formatter.format(product.unitPrice)}</td>
                                    <td>{product.quantity}</td>
                                    <td>{product.discount * 100}%</td>
                                    <td>{product.categoryName}</td>
                                    <td>{product.manufacturerName}</td>
                                    <td><FaPen onClick={() => viewDetailproduct(product.productId)} /></td>
                                    <td><PopupAccessories phoneId={product.productId} phoneName={product.productName} disabled={product.type === 2} /></td>
                                    <td><RiCloseCircleLine color="red" onClick={() => deleteProduct(product.productId)} /></td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </Col>
                {(query === '' && productList.length > itemPerPage) && <Pagination itemPerPage={itemPerPage} totalItems={productList.length} paginate={paginate} />}
            </Row>
        </Container>
    );
}

export default ProductManagement;