import React, { Component, useEffect, useState } from 'react';
import { endpointUser, getWithAuth } from '../../components/HttpUtils';
import { Button } from 'reactstrap';
import Pagination from '../../components/Pagination';
import './style.css';

const OrderManagement = () => {
    const [orderList, setOrderList] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemPerPage] = useState(5);

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
        window.location.replace("http://localhost:3000/admin/order-detail/" + id);
    }

    const indexOfLastItem = currentPage * itemPerPage;
    const indexOfFirstItem = indexOfLastItem - itemPerPage;
    const currentList = orderList.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => { setCurrentPage(pageNumber) }

    return (
        <div>
            <h2 className="alert alert-success " align="center" style={{ marginTop: "2rem" }}>Order Management</h2>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Customer ID</th>
                        <th>Customer Name</th>
                        <th>Date</th>
                        <th>Address</th>
                        <th>Description</th>

                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {currentList.map((order, index) => (
                        <tr key={index}>
                            <td>{order.orderId}</td>
                            <td>{order.customerId}</td>
                            <th>{order.customerFullName}</th>
                            <td>{order.orderDate}</td>
                            <td>{order.orderAddress}</td>
                            <td>{order.description}</td>

                            <th><Button color="info" onClick={() => onDetailOrderClick(order.orderId)}>Detail</Button></th>
                        </tr>
                    ))}
                </tbody>
            </table>
            <hr />
            <Pagination itemPerPage={itemPerPage} totalItems={orderList.length} paginate={paginate} />
        </div>
    );
}

export default OrderManagement;