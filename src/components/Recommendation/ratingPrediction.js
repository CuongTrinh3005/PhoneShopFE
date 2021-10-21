import React, { useState, useEffect } from 'react';
import { endpointPublic, get, post, hostML } from '../HttpUtils';
import ProductList from '../ProductList';
import '../ProductList/item.css'

const RatingPredictionKNN = () => {
    const [recommendList, setRecommendList] = useState([])
    const [recommendProductIds, setRecommendProductIds] = useState([])

    useEffect(() => {
        getRecommendedProductIds().then(() => fetchSimilarProducts())
    }, []);

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
        getRecommendedProductIds()
        setTimeout(function () {
            let body = { "similarProductIds": recommendProductIds }
            post(endpointPublic + "/products/list-ids", body).then((response) => {
                if (response.status === 200) {
                    console.log("Recommended products: ", JSON.stringify(response.data))
                    setRecommendList(response.data)
                }
            }).catch((error) => console.log("Fetching product by id error: " + error))
        }, 2000);
    }

    return (
        <div>
            {recommendList.length > 0 &&
                <div id="recommend-products">
                    <ProductList title="CÓ THỂ BẠN SẼ THÍCH" productList={recommendList} />
                </div>}
        </div>
    );
}

export default RatingPredictionKNN;