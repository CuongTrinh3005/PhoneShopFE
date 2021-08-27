import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Label, Input } from 'reactstrap';
import { endpointUser, postwithAuth, putWithAuth, getWithAuth } from '../../components/HttpUtils';
import { BsStarFill } from "react-icons/bs";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import RatingStar from '.';

toast.configure();
const RatingModal = (props) => {
    const [bookId] = useState(props.bookId);
    const [levelRating, setLevelRating] = useState(0);
    const [comment, setComment] = useState('');

    const [modal, setModal] = useState(false);
    const [alreadyRated, setAlreadyRated] = useState(false);
    const [previousRating, setPreviousRating] = useState({})

    const toggle = () => setModal(!modal);

    const isUserRatedYet = () => {
        if (localStorage.getItem("username") !== null || localStorage.getItem("username") !== "" || localStorage.getItem("username") !== undefined) {
            getWithAuth(endpointUser + `/ratings/check-exist?username=${localStorage.getItem("username")}&bookId=${bookId}`)
                .then((response) => {
                    if (response.status === 200) {
                        setAlreadyRated(response.data);
                        if (response.data) {
                            fetchRating();
                        }
                    }
                }).catch((error) => {
                    console.log("error rating: " + error);
                })
        }
    }

    const fetchRating = () => {
        if (localStorage.getItem("username") !== null || localStorage.getItem("username") !== "" || localStorage.getItem("username") !== undefined) {
            getWithAuth(endpointUser + `/ratings/id?username=${localStorage.getItem("username")}&bookId=${props.bookId}`)
                .then((response) => {
                    if (response.status === 200) {
                        setLevelRating(response.data.levelRating);
                        setComment(response.data.comment);
                        setPreviousRating(response.data);
                    }
                }).catch((error) => {
                    console.log("error rating: " + error);
                })
        }
    }

    useEffect(() => {
        if (localStorage.getItem("username") !== null && localStorage.getItem("username") !== '') {
            isUserRatedYet();
        }
    }, [])

    const rating = (e) => {
        const id = { username: localStorage.getItem("username"), bookId: bookId }
        const ratingBody = { ratingId: id, dateRating: new Date(), levelRating: levelRating, comment: comment }
        if (alreadyRated) {
            putWithAuth(endpointUser + "/ratings", ratingBody).then((response) => {
                if (response.status === 200) {
                    console.log("Update rating successfully!");
                    toast.success("Xin cảm ơn đánh giá của bạn!", {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 2000,
                    });
                }
            }).catch(error => {
                console.log("error rating: " + error);
                if (window.confirm('Do you want login for rating?')) {
                    window.location.replace("http://localhost:3000/account/signin");
                }
            })
        }
        else {
            postwithAuth(endpointUser + "/ratings", ratingBody).then((response) => {
                if (response.status === 200 || response.status === 201) {
                    console.log("Rating new successfully!");
                    toast.success("Xin cảm ơn đánh giá mới của bạn!", {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 2000,
                    });
                }
            }).catch(error => {
                console.log("error rating: " + error);
                if (window.confirm('Vui lòng đăng nhập để tiếp tục?')) {
                    window.location.replace("http://localhost:3000/account/signin");
                }
            })
        }

        toggle();
    }

    const getLevelRating = (score) => {
        setLevelRating(score);
    }

    const validateForm = () => {
        if (levelRating === previousRating.levelRating && comment === previousRating.comment)
            return false;
        return true;
    }

    return (
        <div align="center">
            <BsStarFill id="rating-icon" color="green" onClick={() => toggle()} />
            <Modal isOpen={modal} toggle={toggle} >
                <ModalHeader toggle={toggle}>Đánh giá chất lượng sản phẩm</ModalHeader>
                <ModalBody>
                    <Form onSubmit={(e) => this.rating(e)}>
                        <FormGroup>
                            <RatingStar getLevelRating={getLevelRating} score={levelRating} />
                        </FormGroup>
                        <FormGroup>
                            <Label for="comment">Comment</Label>
                            <Input style={{ width: "20rem" }} type="textarea" name="comment" maxLength="255" value={comment}
                                id="comment" placeholder="Enter your comment!!!" onChange={e => setComment(e.target.value)} />
                        </FormGroup>
                    </Form>
                </ModalBody>
                <ModalFooter>
                    <Button color="primary" onClick={rating} disabled={levelRating === 0 || !validateForm()}>Đánh giá!!!</Button>
                    <Button color="secondary" onClick={toggle}>Cancel</Button>
                </ModalFooter>
            </Modal>
        </div>
    );
}

export default RatingModal;