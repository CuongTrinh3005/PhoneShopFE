import React, { useState, useEffect } from 'react';
import { endpointPublic, get, post, hostML, getWithAuth, endpointUser } from '../HttpUtils';
import ProductList from '../ProductList';
import '../ProductList/item.css'
import ProductSlider from '../ProductSlider';
import NewProductFilter from '../Feature'
import FilterByTopView from '../Feature/FilterByTopView';
import BestSelling from '../Feature/BestSelling';
import FilterByDiscount from '../Feature/FilterByDiscount';

const Home = () => {
    const [recommendCFList, setRecommendCFList] = useState([])
    const [recommendListBaseHistory, setRecommendListBaseHistory] = useState([])
    const [recommendListBasePurchasingHistory, setRecommendListBasePurchasingHistory] = useState([])

    useEffect(() => {
        if (localStorage.getItem('userId') !== null && localStorage.getItem('userId') !== '') {
            setUp();
        }
    }, []);

    const getRecommendedCFProducts = async () => {
        await get(hostML + `/recommend-products/cf?userid=${localStorage.getItem("userId")}`)
            .then((response) => {
                if (response.status === 200) {
                    console.log("CF API call");
                    let listRecommendProducts = response.data, recommend_ids = [];
                    for (let item_info of listRecommendProducts) {
                        // Get id of similar products
                        recommend_ids.push(item_info.product_id)
                    }
                    console.log("Recommeded ids: ", JSON.stringify(recommend_ids))
                    fetchSimilarProducts(recommend_ids, 1);
                }
            }).catch((error) => {
                console.log("error rating: " + error);
            })
    }

    const getRecommendedCFDLProducts = async () => {
        await get(hostML + `/recommend-products/cf-dl?userid=${localStorage.getItem("userId")}`)
            .then((response) => {
                if (response.status === 200) {
                    let listRecommendProducts = response.data, recommend_ids = [];
                    for (let item_list_info of listRecommendProducts) {
                        // Get id of similar products
                        if (item_list_info[0].startsWith('PD'))
                            recommend_ids.push(item_list_info[0])
                        else recommend_ids.push(item_list_info[1])
                    }
                    console.log("Recommeded ids: ", JSON.stringify(recommend_ids))
                    fetchSimilarProducts(recommend_ids, 1);
                }
            }).catch((error) => {
                console.log("error rating: " + error);
            })
    }

    const getRecommendedProductsByViewHistory = async () => {
        await get(hostML + `/recommend-products/based-viewing-history?userid=${localStorage.getItem("userId")}`)
            .then((response) => {
                if (response.status === 200) {
                    let listRecommendProducts = response.data, recommend_ids = [];
                    for (let item_list_info of listRecommendProducts) {
                        // Get id of similar products
                        if (item_list_info[0].startsWith('PD'))
                            recommend_ids.push(item_list_info[0])
                        else recommend_ids.push(item_list_info[1])
                    }
                    console.log("Recommeded viewing ids: ", JSON.stringify(recommend_ids))
                    fetchSimilarProducts(recommend_ids, 2);
                }
            }).catch((error) => {
                console.log("error rating: " + error);
            })
    }

    const getRecommendedProductsBasedOnPurchasingHistory = async () => {
        await get(hostML + `/recommend-products/based-purchasing-history?userid=${localStorage.getItem("userId")}`)
            .then((response) => {
                if (response.status === 200) {
                    let listRecommendProducts = response.data, recommend_ids = [];
                    for (let item_list_info of listRecommendProducts) {
                        // Get id of similar products
                        if (item_list_info[0].startsWith('PD'))
                            recommend_ids.push(item_list_info[0])
                        else recommend_ids.push(item_list_info[1])
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
                    setRecommendCFList(response.data)
                else if (type === 2)
                    setRecommendListBaseHistory(response.data)
                else if (type === 3) {
                    setRecommendListBasePurchasingHistory(response.data);
                }
            }
        }).catch((error) => console.log("Fetching product by id error: " + error))
    }

    const setUp = () => {
        getWithAuth(endpointUser + "/ratings/user/" + localStorage.getItem('userId')).then((response) => {
            if (response.status === 200) {
                if (response.data.length > 0) {
                    getRecommendedCFDLProducts().then(() => {
                        getRecommendedProductsByViewHistory().then(() => {
                            getRecommendedProductsBasedOnPurchasingHistory();
                        })
                    });
                }
                else {
                    getRecommendedCFProducts().then(() => {
                        getRecommendedProductsByViewHistory().then(() => {
                            getRecommendedProductsBasedOnPurchasingHistory();
                        })
                    });
                }
            }
        })
    }

    return (
        <div className="home-page">
            <h1 className="alert alert-info" align="center"
                style={{ marginTop: "2rem" }}>CSHOP XIN CHÀO</h1>

            {recommendCFList.length > 0 &&
                <div id="recommend-products">
                    <ProductSlider title="CÓ THỂ BẠN SẼ THÍCH" productList={recommendCFList} />
                </div>}

            {recommendListBaseHistory.length > 0 &&
                <div >
                    <ProductSlider title="TƯƠNG TỰ SẢN PHẨM ĐÃ XEM" productList={recommendListBaseHistory} />
                </div>}

            {recommendListBasePurchasingHistory.length > 0 &&
                <div >
                    <ProductSlider title="TƯƠNG TỰ SẢN PHẨM ĐÃ MUA" productList={recommendListBasePurchasingHistory} />
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