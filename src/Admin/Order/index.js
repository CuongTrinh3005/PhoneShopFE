import React, { useEffect, useState } from 'react';
import { endpointUser, getWithAuth } from '../../components/HttpUtils';
import Pagination from '../../components/Pagination';
import './style.css';
import { FaPen } from 'react-icons/fa';
import { useHistory } from 'react-router-dom';
import { Row, Col, } from 'reactstrap';
import { formatDate } from '../../components/Helper';

const OrderManagement = () => {
    const history = useHistory();
    const [orderList, setOrderList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemPerPage] = useState(5);
    const [query, setQuery] = useState("");
    const [dateFilter, setDateFilter] = useState('');

    const fetchOrdersInDateDescending = () => {
        getWithAuth(endpointUser + "/orders/date-descending").then((response) => {
            if (response.status === 200) {
                setOrderList(response.data);
                console.log("order data:" + response.data)
            }
        }).catch((error) => console.log("Fetching orders error: " + error))
    }

    useEffect(() => {
        fetchOrdersInDateDescending();
    }, []);

    const onDetailOrderClick = (id) => {
        history.push(`/admin/order-detail/${id}`);
    }

    var currentList = [], stageOne = [], stageTwo = [], isFiltering = false;
    if (query === '') stageOne = [...orderList];
    else {
        stageOne = orderList.filter((order) => order['orderId'].toLowerCase().includes(query)
            || order['customerId'].toLowerCase().includes(query) || order['customerFullName'].toLowerCase().includes(query));
        currentList = [...stageOne];
        isFiltering = true;
    }
    stageTwo = [...stageOne];
    if (dateFilter !== '' && dateFilter !== 'NaN-NaN-NaN') {
        stageTwo = stageTwo.filter((order) => formatDate(order['orderDate']).includes(dateFilter));
        currentList = [...stageTwo];
        isFiltering = true;
    }
    if (isFiltering === false) {
        const indexOfLastItem = currentPage * itemPerPage;
        const indexOfFirstItem = indexOfLastItem - itemPerPage;
        currentList = orderList.slice(indexOfFirstItem, indexOfLastItem);
    }

    const paginate = (pageNumber) => { setCurrentPage(pageNumber) }

    const onSearching = (event) => {
        let query = event.target.value.toLowerCase().trim();
        setQuery(query);
    }

    const hanldeDateChange = (event) => {
        console.log("Date filter: " + formatDate(event.target.value).toString().slice(0, 11))
        setDateFilter(formatDate(event.target.value).toString().slice(0, 11));
    }

    return (
        <div>
            <h2 className="alert alert-success " align="center" style={{ marginTop: "2rem" }}>QUẢN LÝ HÓA ĐƠN</h2>
            <Row>
                <Col>
                    <input style={{ width: "25rem" }} type="search"
                        placeholder="Nhập mã đơn hàng, mã khách hàng, tên khách hàng.."
                        onChange={onSearching} />
                </Col>
                <Col>
                    <input type="date" onChange={hanldeDateChange} />
                </Col>
            </Row>

            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Mã khách hàng</th>
                        <th>Tên khách hàng</th>
                        <th>Ngày đặt</th>
                        <th>Địa chỉ</th>
                        <th>Mô tả</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {currentList.map((order, index) => (
                        <tr key={index}>
                            <td>{order.orderId}</td>
                            <td>{order.customerId}</td>
                            <th>{order.customerFullName}</th>
                            <td>{formatDate(order.orderDate)}</td>
                            <td>{order.orderAddress}</td>
                            <td>{order.description}</td>
                            <td><FaPen onClick={() => onDetailOrderClick(order.orderId)} /></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <hr />
            {(query === '' && dateFilter === '') && <Pagination itemPerPage={itemPerPage} totalItems={orderList.length} paginate={paginate} />}
        </div>
    );
}

export default OrderManagement;