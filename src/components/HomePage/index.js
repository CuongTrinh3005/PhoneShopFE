import React, { useState, useEffect } from 'react';
import { endpointPublic, get, post, hostML } from '../HttpUtils';
import ProductList from '../ProductList';
import '../ProductList/item.css'
import ProductSlider from '../ProductSlider';
import NewProductFilter from '../Feature'
import FilterByTopView from '../Feature/FilterByTopView';
import BestSelling from '../Feature/BestSelling';
import FilterByDiscount from '../Feature/FilterByDiscount';

const Home = () => {
    const [productList, setProductList] = useState([]);
    const [recommendList, setRecommendList] = useState([])
    const [recommendListBaseHistory, setRecommendListBaseHistory] = useState([])
    const [recommendListBaseRatingHistory, setRecommendListBaseRatingHistory] = useState([])

    useEffect(() => {
        if (localStorage.getItem('userId') !== null && localStorage.getItem('userId') !== '') {
            getRecommendedProducts().then(() => {
                getRecommendedProductsByViewHistory().then(() => {
                    getRecommendedProductsBasedOnRatingHistory();
                })
            });
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

    const getRecommendedProductsByViewHistory = async () => {
        await get(hostML + `/recommend-products/based-viewing-history?userid=${localStorage.getItem("userId")}`)
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

    const getRecommendedProducts = async () => {
        await get(hostML + `/recommend-products/based-on-similar-users?userid=${localStorage.getItem("userId")}`)
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

    const getRecommendedProductsBasedOnRatingHistory = async () => {
        await get(hostML + `/recommend-products/based-high-rating-history?userid=${localStorage.getItem("userId")}`)
            .then((response) => {
                if (response.status === 200) {
                    let listRecommendProducts = response.data, recommend_ids = [];
                    for (let item_list_info of listRecommendProducts) {
                        // Get id of similar products
                        recommend_ids.push(item_list_info[0])
                    }
                    console.log("Recommeded ids: ", JSON.stringify(recommend_ids))
                    fetchSimilarProducts(recommend_ids, 3);
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
                else if (type === 3) {
                    setRecommendListBaseRatingHistory(response.data);
                }
            }
        }).catch((error) => console.log("Fetching product by id error: " + error))
    }

    return (
        <div className="home-page">
            <h1 className="alert alert-info" align="center"
                style={{ marginTop: "2rem" }}>CSHOP XIN CHÀO</h1>

            {recommendList.length > 0 &&
                <div id="recommend-products">
                    <ProductSlider title="GỢI Ý TỪ NGƯỜI DÙNG TƯƠNG TỰ" productList={recommendList} />
                </div>}

            {recommendListBaseHistory.length > 0 &&
                <div >
                    <ProductSlider title="TƯƠNG TỰ SẢN PHẨM ĐÃ XEM" productList={recommendListBaseHistory} />
                </div>}

            {recommendListBaseRatingHistory.length > 0 &&
                <div >
                    <ProductSlider title="CÓ THỂ BẠN SẼ THÍCH" productList={recommendListBaseRatingHistory} />
                </div>}

            <div  >
                <NewProductFilter />
                <FilterByTopView />
                <BestSelling />
                <FilterByDiscount />
            </div>
        </div>
    );
}

export default Home;