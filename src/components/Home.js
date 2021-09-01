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
        </div>
    );
}

export default Home;