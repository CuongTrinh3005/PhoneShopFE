import React, { useState, useEffect } from 'react';
import { endpointPublic, get } from './HttpUtils';
import ProductList from './ProductList';
import './ProductList/item.css'

const Home = () => {
    const [bookList, setBookList] = useState([]);

    useEffect(() => {
        fetchAllPublicBooks();
    }, []);

    const fetchAllPublicBooks = () => {
        get(endpointPublic + "/books").then((response) => {
            if (response.status === 200) {
                setBookList(response.data);
                console.log("Books: ", response.data)
            }
        })
    }

    return (
        <div>
            <h1 className="alert alert-info" align="center"
                style={{ marginTop: "2rem" }}>CSHOP XIN CHÀO</h1>
            <br />
            <ProductList title="DANH MỤC SẢN PHẨM" bookList={bookList} />
            {/* <footer className="row">
                <p className="col-sm-10">@Copyright: Author: TrinhQuocCuong - ClassNamclassName:
                    D17CQCP01-N - Student ID: N17DCCN017</p>
                <div className="col-sm-2">
                    <h5 className="row">HOTLINE: 123 456 789 0</h5>
                    <a className="row" href="admin/home/index.htm">Admin</a>
                </div>

            </footer> */}
        </div>
    );
}

export default Home;