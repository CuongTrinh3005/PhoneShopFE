import React, { useState } from 'react';
import './star.css';
import { FaStar } from 'react-icons/fa';

const RatingStar = ({ getScore, score }) => {
    const [rating, setRating] = useState(score);
    const [hover, setHover] = useState(null);

    const handleClickRating = (value) => {
        getScore(value);
        setRating(value);
    }

    const checkRating = () => {
        switch (rating) {
            case 1: {
                return <p className="describe-str">Cực kỳ tệ</p>
            }
            case 2: {
                return <p className="describe-str">Tệ</p>
            }
            case 3: {
                return <p className="describe-str">Tốt</p>
            }
            case 4: {
                return <p className="describe-str">Rất tốt!</p>
            }
            case 5: {
                return <p className="describe-str">Xuất sắc!!!</p>
            }
            default: break;
        }
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
                            onClick={() => handleClickRating(ratingValue)}
                        />
                        <FaStar
                            className="star"
                            size={50}
                            color={ratingValue <= (hover || rating) ? "#ffc107" : "#e4e5e9"}
                            onMouseEnter={() => setHover(ratingValue)}
                            onMouseLeave={() => setHover(null)}
                        />
                    </label>
                );
            })}
            {checkRating(rating)}
        </div>
    );
}

export default RatingStar;