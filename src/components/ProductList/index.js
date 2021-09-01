import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button, Col, Container, Row
} from 'reactstrap';
import { formatter } from '../Formatter';
import './item.css'

const ProductList = ({ title, bookList }) => {
  const history = useHistory();

  return (
    <div >
      <Container style={{ height: "2rem" }}>
        <Row className="parent">
          <h5>{title}</h5>
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
        <Row>
          {/* <footer className="row">
            <p className="col-sm-10">@Copyright: Author: TrinhQuocCuong - Class:
              D17CQCP01-N - Student ID: N17DCCN017</p>
            <div className="col-sm-2">
              <h6 className="row">HOTLINE: 123 456 789 0</h6>
            </div>
          </footer> */}
        </Row>
      </Container>
    </div >
  );
};

export default ProductList;