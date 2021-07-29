import React, { Component, useState, useEffect } from 'react';
import './star.css';
import { FaStar } from 'react-icons/fa';
import { Button } from 'reactstrap';
import { endpointUser, get, getWithAuth, postwithAuth, putWithAuth } from '../HttpUtils';

const RatingStar = (props) => {
    const [rating, setRating] = useState(null);
    const [hover, setHover] = useState(null);

    const fetchRating = () => {
        if (localStorage.getItem("username") !== null || localStorage.getItem("username") !== "" || localStorage.getItem("username") !== undefined) {
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
    }

    useEffect(() => {
        if (localStorage.getItem("username") !== null && localStorage.getItem("username") !== '') {
            fetchRating();
        }
    }, [])

    const mergeRatingForUser = (ratingLevel) => {
        // setRating(ratingLevel);
        const id = { username: localStorage.getItem("username"), bookId: props.bookId }
        const ratingBody = { ratingId: id, dateRating: new Date(), levelRating: ratingLevel }
        putWithAuth(endpointUser + "/ratings", ratingBody).then((response) => {
            if (response.status === 200) {
                console.log("Update rating successfully!");
                alert("Thanks a lot! We're updating your rating!");
                window.location.reload(); // reload to update avarage rating.
            }
        }).catch(error => {
            // console.log("error updating rating: " + error);
            postwithAuth(endpointUser + "/ratings", ratingBody).then((response) => {
                if (response.status === 200 || response.status === 201) {
                    console.log("Rating new successfully!");
                    alert("Thanks a lot! We're creating your rating!");
                    window.location.reload(); // reload to update avarage rating.
                }
            }).catch(error => {
                console.log("error rating: " + error);
                if (window.confirm('Do you want login for rating?')) {
                    window.location.replace("http://localhost:3000/account/signin");
                }
            })
        })
    }

    const checkRating = (point) => {
        switch (rating) {
            case 1: {
                return <p>Very bad</p>
                break;
            }
            case 2: {
                return <p>Bad</p>
                break;
            }
            case 3: {
                return <p>Good enough</p>
                break;
            }
            case 4: {
                return <p>I like it!</p>
                break;
            }
            case 5: {
                return <p>Excellent</p>
                break;
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
                            onClick={() => setRating(ratingValue)}
                        // onClick={() => mergeRatingForUser(ratingValue)}
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
            <Button color="primary" onClick={() => mergeRatingForUser(rating)}>Rating</Button>
            {checkRating(rating)}
        </div>
    );
}

export default RatingStar;