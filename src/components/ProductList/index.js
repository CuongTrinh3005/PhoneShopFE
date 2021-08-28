import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button, Col, Container, Row
} from 'reactstrap';
import { formatter } from '../Formatter';
import { endpointPublic, get } from '../HttpUtils';
import './item.css'

const ProductList = ({ categoryName }) => {
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
            <Col md="3" className="item" key={book.bookId}>
              <Card>
                {(book.photo === null || book.photo === '')
                  ? <div><Link to={{ pathname: `/detail/` + book.bookId }}><CardImg style={{ width: "100px" }, { height: "150px" }} src={window.location.origin + '/logo192.png'} alt="Card image cap" /></Link></div>
                  : <div><Link to={{ pathname: `/detail/` + book.bookId }}><CardImg style={{ width: "100px" }, { height: "150px" }} src={`data:image/jpeg;base64,${book.photo}`} alt="Loading..."></CardImg></Link></div>}

                <CardBody>
                  <CardTitle className="title" tag="h5">{book.bookName}</CardTitle>
                  <CardSubtitle tag="h6" className="mb-2 text-muted">{formatter.format(book.unitPrice)}</CardSubtitle>
                  <CardText></CardText>
                  <Link to={{ pathname: `/detail/` + book.bookId }}>
                    <Button color="info">Xem chi tiết</Button>
                  </Link>
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