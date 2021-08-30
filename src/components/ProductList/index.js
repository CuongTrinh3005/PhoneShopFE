import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import {
  Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button, Col, Container, Row
} from 'reactstrap';
import { formatter } from '../Formatter';
import { endpointPublic, get } from '../HttpUtils';
import './item.css'

const ProductList = ({ categoryName }) => {
  const history = useHistory();
  const [bookList, setBookList] = useState([]);

  useEffect(() => {
    fetchAllPublicBooks();
    if (categoryName !== '')
      fetchBookByCategoryName(categoryName);
  }, [categoryName]);

  const fetchAllPublicBooks = () => {
    get(endpointPublic + "/books").then((response) => {
      if (response.status === 200) {
        setBookList(response.data);
        console.log("Books: ", response.data)
      }
    })
  }

  const fetchBookByCategoryName = (categoryName) => {
    get(endpointPublic + "/books/search/category?name=" + categoryName).then((response) => {
      if (response.status === 200) {
        setBookList(response.data);
      }
    })
  }

  return (
    <div >
      <Container style={{ height: "2rem" }}>
        <Row className="parent">
          <h5>DANH MỤC SẢN PHẨM</h5>
          {bookList.map((book) => (
            <Col md="3" className="item" key={book.bookId} style={{ cursor: "pointer" }}>
              <Card onClick={() => history.push(`/detail/` + book.bookId)}>
                {(book.photo === null || book.photo === '')
                  ? <div><CardImg style={{ width: "100%" }, { height: "150px" }} src={window.location.origin + '/product-default.png'} alt="Card image cap" /></div>
                  : <div><CardImg style={{ width: "100%" }, { height: "150px" }} src={`data:image/jpeg;base64,${book.photo}`} alt="Loading..."></CardImg></div>}

                <CardBody>
                  <CardTitle className="title" tag="h5">{book.bookName}</CardTitle>
                  <CardSubtitle tag="h6" className="mb-2 text-muted">{formatter.format(book.unitPrice)}</CardSubtitle>
                  <CardText></CardText>

                  <Button color="info" onClick={() => history.push(`/detail/` + book.bookId)}>Xem chi tiết</Button>

                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </Container>
    </div >
  );
};

export default ProductList;