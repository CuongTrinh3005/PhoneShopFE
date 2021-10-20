import React, { useState, useEffect } from 'react';
import { endpointPublic, get, post, hostML } from '../HttpUtils';
import ProductList from '../ProductList';
import '../ProductList/item.css'
import './home.css'

const Home = () => {
    const [productList, setProductList] = useState([]);
    const [recommendList, setRecommendList] = useState([])
    const [recommendProductIds, setRecommendProductIds] = useState([])

    useEffect(() => {
        if (localStorage.getItem("userId") !== null && localStorage.getItem("userId") !== '') {
            getRecommendedProductIds().then(() => fetchSimilarProducts());
            fetchAllPublicProducts();
        }
        else {
            fetchAllPublicProducts();
        }
    }, [recommendList]);

    const fetchAllPublicProducts = () => {
        get(endpointPublic + "/products").then((response) => {
            if (response.status === 200) {
                setProductList(response.data);
            }
        })
    }

    const getRecommendedProductIds = async () => {
        await get(hostML + `/recommend-products/knn?userid=${localStorage.getItem("userId")}`)
            .then((response) => {
                if (response.status === 200) {
                    let listRecommendProducts = response.data, recommend_ids = [];
                    for (let item_list_info of listRecommendProducts) {
                        // Get id of similar products
                        recommend_ids.push(item_list_info[0])
                    }
                    console.log("Recommeded ids: ", JSON.stringify(recommend_ids))
                    setRecommendProductIds(recommend_ids);
                }
            }).catch((error) => {
                console.log("error rating: " + error);
            })
    }

    const fetchSimilarProducts = () => {
        let body = { "similarProductIds": recommendProductIds }
        post(endpointPublic + "/products/list-ids", body).then((response) => {
            if (response.status === 200) {
                // console.log("Recommended products: ", JSON.stringify(response.data))
                setRecommendList(response.data)
            }
        }).catch((error) => console.log("Fetching product by id error: " + error))
    }

    return (
        <div className="home-page">
            <h1 className="alert alert-info" align="center"
                style={{ marginTop: "2rem" }}>CSHOP XIN CHÀO</h1>

            {recommendList.length > 0 &&
                <div id="recommend-products">
                    <ProductList title="DÀNH CHO BẠN" productList={recommendList} />
                </div>}

            <div id={recommendList.length !== 0 ? "all-products" : ''} >
                <hr />
                <ProductList title="DANH MỤC SẢN PHẨM" productList={productList} />
            </div>
        </div>
    );
}

export default Home;