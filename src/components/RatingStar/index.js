import React, { Component, useState, useEffect } from 'react';
import './star.css';
import { FaStar } from 'react-icons/fa';
import { Button } from 'reactstrap';
import { endpointUser, get, getWithAuth, postwithAuth, putWithAuth } from '../HttpUtils';

const RatingStar = (props) => {
    const [rating, setRating] = useState(null);
    const [hover, setHover] = useState(null);

    const fetchRating = () => {
        getWithAuth(endpointUser + `/ratings/id?username=${localStorage.getItem("username")}&bookId=${props.bookId}`)
            .then((response) => {
                if (response.status === 200) {
                    setRating(response.data.levelRating)
                    setHover(response.data.levelRating)
                }
            }).catch((error) => {
                console.log("error rating: " + error);
            })
    }

    useEffect(() => {
        fetchRating();
    }, [])

    const updateRatingForUser = (ratingLevel) => {
        setRating(ratingLevel);
        const id = { username: localStorage.getItem("username"), bookId: props.bookId }
        const ratingBody = { ratingId: id, dateRating: new Date(), levelRating: ratingLevel }
        putWithAuth(endpointUser + "/ratings", ratingBody).then((response) => {
            if (response.status === 200) {
                console.log("Update rating successfully!");
            }
        }).catch(error => {
            // console.log("error updating rating: " + error);
            postwithAuth(endpointUser + "/ratings", ratingBody).then((response) => {
                if (response.status === 200 || response.status === 201) {
                    console.log("Rating new successfully!");
                }
            }).catch(error => {
                console.log("error rating: " + error);
            })
        })
    }

    return (
        <div>
            {[...Array(5)].map((star, i) => {
                const ratingValue = i + 1;
                return (
                    <label key={i}>
                        <input
                            type="radio"
                            name="rating"
                            value={ratingValue}
                            // onClick={() => setRating(ratingValue)} 
                            onClick={() => updateRatingForUser(ratingValue)}
                        />
                        <FaStar
                            className="star"
                            size={20}
                            color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                            onMouseEnter={() => setHover(ratingValue)}
                            onMouseLeave={() => setHover(null)}
                        />
                    </label>
                );
            })}
            <p>Rating is {rating}</p>
        </div>
    );
}

export default RatingStar;