import React, { useEffect, useState } from 'react';
import { endpointUser, getWithAuth } from '../../components/HttpUtils';
import { Row, Col, } from 'reactstrap';
import './style.css'
import Pagination from '../../components/Pagination';

const RatingManagement = () => {
    const [ratingList, setRatingList] = useState([]);
    const [query, setQuery] = useState('');
    const [score, setScore] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemPerPage] = useState(5);

    const fetchRatings = () => {
        getWithAuth(endpointUser + "/ratings").then((response) => {
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
        stageOne = ratingList.filter((rating) => rating['username'].toString().includes(query)
            || rating['bookName'].toLowerCase().includes(query) || rating['bookId'].toString().toLowerCase().includes(query));
        currentList = [...stageOne];
        isFiltering = true;
    }
    stageTwo = [...stageOne];
    if (score > 0) {
        stageTwo = stageTwo.filter((rating) => rating['levelRating'].toString() === score);
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
                        placeholder="Nhập mã sách, tên sách, mã khách hàng.."
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
                        <th>Username</th>
                        <th>Mã sách</th>
                        <th>Tên sách</th>
                        <th>Hình ảnh</th>
                        <th>Ngày đánh giá</th>
                        <th>Thang điểm</th>
                        <th>Bình luận</th>
                    </tr>
                </thead>
                <tbody>
                    {currentList.map((rating, index) => (
                        <tr key={index}>
                            <td>{rating.username}</td>
                            <td>{rating.bookId}</td>
                            <td>{rating.bookName}</td>
                            <td>
                                <img src={`data:image/jpeg;base64,${rating.photo}`}
                                    alt="No image" height="50" width="100">
                                </img>
                            </td>
                            <td>{rating.ratingDate}</td>
                            <td><strong>{rating.levelRating}</strong></td>
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