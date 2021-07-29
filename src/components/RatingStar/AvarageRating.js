import React, { useState, useEffect } from 'react';
import './star.css';
import { FaStar } from 'react-icons/fa';
import { endpointPublic, get } from '../HttpUtils';

const AvarageRatingStar = (props) => {
    const [rating, setRating] = useState(null);
    const [hover, setHover] = useState(null);

    const fetchRatingOfBook = (id) => {
        get(endpointPublic + `/ratings/books/` + id)
            .then((response) => {
                if (response.status === 200) {
                    //setListAllRatingOfBook(response.data);
                    let sum = 0;
                    if (response.data.length > 0) {
                        for (let index = 0; index < response.data.length; index++) {
                            sum += response.data[index]["levelRating"];
                        }
                    }
                    setRating(Math.round(sum / response.data.length));
                    console.log("Avarage rating of book is: " + sum / response.data.length);
                }
            }).catch((error) => {
                console.log("error rating: " + error);
            })
    }

    useEffect(() => {
        fetchRatingOfBook(props.bookId);
    }, [])

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
                        />
                        <FaStar
                            className="star"
                            size={20}
                            color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                        />
                    </label>
                );
            })}
        </div>
    );
}

export default AvarageRatingStar;