import React, { Component } from 'react';
import { endpointUser, getWithAuth } from '../../components/HttpUtils';
import './style.css'

class RatingManagement extends Component {
    state = { ratingList: [] }

    fetchRatings() {
        getWithAuth(endpointUser + "/ratings").then((response) => {
            if (response.status === 200) {
                this.setState({ ratingList: response.data })
            }
        }).catch((error) => console.log("Fetching ratings error: " + error))
    }

    componentDidMount() {
        this.fetchRatings();
    }

    render() {
        return (
            <div>
                <h3 className="alert alert-warning" align="center">DANH SÁCH ĐÁNH GIÁ CHẤT LƯỢNG SẢN PHẨM</h3>

                <table className="table table-hover">
                    <thead>
                        <tr>
                            <td>STT</td>
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
                        {this.state.ratingList.map((rating, index) => (
                            <tr key={index}>
                                <td>{index + 1}</td>
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
            </div>
        );
    }
}

export default RatingManagement;