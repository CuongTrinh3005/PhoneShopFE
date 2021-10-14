import ReactStars from "react-rating-stars-component";
import React, { useState } from "react";
import { FaStar, FaStarHalfAlt, FaRegStar } from 'react-icons/fa';

const RatingStarLib = ({ getScore, score }) => {
    const [rating, setRating] = useState(0);
    const ratingChanged = (newRating) => {
        console.log("New rating lib:", newRating);
        getScore(newRating);
        setRating(newRating);
    };

    const checkRating = () => {
        if (rating >= 0.5 && rating < 2)
            return <p className="describe-str">Cực kỳ tệ</p>
        else if (rating >= 1.5 && rating <= 2.5)
            return <p className="describe-str">Tệ</p>
        else if (rating === 3)
            return <p className="describe-str">Tạm ổn</p>
        else if (rating >= 3.5 && rating <= 4)
            return <p className="describe-str">Tốt!</p>
        else if (rating === 4.5)
            return <p className="describe-str">Rất tốt!!!</p>
        else if (rating === 5)
            return <p className="describe-str">Xuất sắc!!!</p>
    }

    return (
        <div>
            <ReactStars
                size={50}
                count={5}
                activeColor="#ffd700"
                value={score}
                a11y={false}
                isHalf={true}
                emptyIcon={<FaStar />}
                halfIcon={<FaStarHalfAlt />}
                filledIcon={<FaStar />}
                onChange={ratingChanged}
            />
            {checkRating(rating)}
        </div>
    )

}

export default RatingStarLib