import React, { useEffect, useState } from 'react';
import { endpointAdmin, endpointUser, getWithAuth } from '../../components/HttpUtils';
import { Row, Col, } from 'reactstrap';
import './style.css'
import Pagination from '../../components/Pagination';
import { formatDate } from '../../components/Helper';

const RatingManagement = () => {
    const [ratingList, setRatingList] = useState([]);
    const [query, setQuery] = useState('');
    const [score, setScore] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemPerPage] = useState(5);

    const fetchRatings = () => {
        getWithAuth(endpointAdmin + "/ratings").then((response) => {
            if (response.status === 200) {
                setRatingList(response.data);
            }
        }).catch((error) => console.log("Fetching ratings error: " + error))
    }

    useEffect(() => {
        fetchRatings();
    }, []);

    const onSearching = (event) => {
        let query = event.target.value.toLowerCase().trim();
        setQuery(query);
    }

    const onChangeRatingScore = (event) => {
        setScore(event.target.value);
    }

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber)
    }

    var currentList = [], stageOne = [], stageTwo = [], isFiltering = false;
    if (query === '') stageOne = [...ratingList];
    else {
        stageOne = ratingList.filter((rating) => rating['userId'].toString().toLowerCase().includes(query)
            || rating['productName'].toLowerCase().includes(query) || rating['productId'].toString().toLowerCase().includes(query));
        currentList = [...stageOne];
        isFiltering = true;
    }
    stageTwo = [...stageOne];
    if (score > 0) {
        stageTwo = stageTwo.filter((rating) => rating['score'].toString() === score);
        currentList = [...stageTwo];
        isFiltering = true;
    }
    if (isFiltering === false) {
        const indexOfLastItem = currentPage * itemPerPage;
        const indexOfFirstItem = indexOfLastItem - itemPerPage;
        currentList = ratingList.slice(indexOfFirstItem, indexOfLastItem);
    }

    return (
        <div>
            <h3 className="alert alert-warning" align="center">DANH SÁCH ĐÁNH GIÁ CHẤT LƯỢNG SẢN PHẨM</h3>
            <Row>
                <Col>
                    <input style={{ width: "20rem" }} type="search"
                        placeholder="Nhập mã sản phẩm, tên sản phẩm, mã khách hàng.."
                        onChange={onSearching} />
                </Col>
                <Col>
                    <label for="score" style={{ paddingRight: "1rem" }}>Điểm đánh giá  </label>
                    <input name="score" type="number" min="1" max="5" onChange={onChangeRatingScore}
                        placeholder="Điểm" />
                </Col>
            </Row>
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>UserId</th>
                        <th>Mã sản phẩm</th>
                        <th>Tên sản phẩm</th>
                        <th>Ảnh</th>
                        <th>Ngày đánh giá</th>
                        <th>Thang điểm</th>
                        <th>Bình luận</th>
                    </tr>
                </thead>
                <tbody>
                    {currentList.map((rating, index) => (
                        <tr key={index}>
                            <td>{rating.userId}</td>
                            <td>{rating.productId}</td>
                            <td>{rating.productName}</td>
                            <td>
                                {rating.image === null ?
                                    <img src={window.location.origin + '/product-default.png'}
                                        height="100" width="100" />
                                    :
                                    <img src={`data:image/jpeg;base64,${rating.image}`}
                                        height="100" width="100">
                                    </img>
                                }
                            </td>
                            <td>{formatDate(rating.createdDate)}</td>
                            <td><strong>{rating.score}</strong></td>
                            <td>{rating.comment}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {(query === '') && <Pagination itemPerPage={itemPerPage} totalItems={ratingList.length} paginate={paginate} />}
        </div>
    );
}

export default RatingManagement;