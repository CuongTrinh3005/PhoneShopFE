import React, { useState, useEffect } from 'react';
import { endpointPublic, get, post, hostML } from '../HttpUtils';
import ProductList from '../ProductList';
import '../ProductList/item.css'
import ProductSlider from '../ProductSlider';

const Home = () => {
    const [productList, setProductList] = useState([]);
    const [recommendList, setRecommendList] = useState([])
    const [recommendListBaseHistory, setRecommendListBaseHistory] = useState([])

    useEffect(() => {
        if (localStorage.getItem('userId') !== null && localStorage.getItem('userId') !== '') {
            getRecommendedProducts();
            getRecommendedProductsByViewHistory();
        }
        fetchAllPublicProducts();
    }, []);

    const fetchAllPublicProducts = () => {
        get(endpointPublic + "/products").then((response) => {
            if (response.status === 200) {
                setProductList(response.data);
            }
        })
    }

    const getRecommendedProductsByViewHistory = () => {
        get(hostML + `/recommend-products/based-viewing-history?userid=${localStorage.getItem("userId")}`)
            .then((response) => {
                if (response.status === 200) {
                    let listRecommendProducts = response.data, recommend_ids = [];
                    for (let item_list_info of listRecommendProducts) {
                        // Get id of similar products
                        recommend_ids.push(item_list_info[0])
                    }
                    console.log("Recommeded ids: ", JSON.stringify(recommend_ids))
                    fetchSimilarProducts(recommend_ids, 2);
                }
            }).catch((error) => {
                console.log("error rating: " + error);
            })
    }

    const getRecommendedProducts = () => {
        get(hostML + `/recommend-products/knn?userid=${localStorage.getItem("userId")}`)
            .then((response) => {
                if (response.status === 200) {
                    let listRecommendProducts = response.data, recommend_ids = [];
                    for (let item_list_info of listRecommendProducts) {
                        // Get id of similar products
                        recommend_ids.push(item_list_info[0])
                    }
                    console.log("Recommeded ids: ", JSON.stringify(recommend_ids))
                    fetchSimilarProducts(recommend_ids, 1);
                }
            }).catch((error) => {
                console.log("error rating: " + error);
            })
    }

    const fetchSimilarProducts = (listIds, type) => {
        let body = { "similarProductIds": listIds }
        post(endpointPublic + "/products/list-ids", body).then((response) => {
            if (response.status === 200) {
                console.log("Recommended products: ", JSON.stringify(response.data))
                if (type === 1)
                    setRecommendList(response.data)
                else if (type === 2)
                    setRecommendListBaseHistory(response.data)
            }
        }).catch((error) => console.log("Fetching product by id error: " + error))
    }

    return (
        <div className="home-page">
            <h1 className="alert alert-info" align="center"
                style={{ marginTop: "2rem" }}>CSHOP XIN CHÀO</h1>

            {recommendList.length > 0 &&
                <div id="recommend-products">
                    <ProductSlider title="DÀNH CHO BẠN" productList={recommendList} />
                </div>}

            {recommendListBaseHistory.length > 0 &&
                <div >
                    <ProductSlider title="TƯƠNG TỰ SẢN PHẨM ĐÃ XEM" productList={recommendList} />
                </div>}

            <div id={recommendList.length !== 0 ? "all-products" : ''} >
                <hr />
                <ProductList title="DANH MỤC SẢN PHẨM" productList={productList} />
            </div>
        </div>
    );
}

export default Home;