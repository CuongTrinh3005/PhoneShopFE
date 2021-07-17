import React, { Component } from 'react';
import {
  Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button, Col, Container, Row
} from 'reactstrap';
import { endpointPublic, get } from '../HttpUtils';
import './item.css'

class CartItem extends Component {
  state = { bookList: [] }

  componentDidMount() {
    this.fetchAllPublicBooks();
  }

  fetchAllPublicBooks() {
    get(endpointPublic + "/books").then((response) => {
      if (response.status === 200) {
        this.setState({ bookList: response.data })
        console.log("Books: ", response.data)
      }
    })
  }

  formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 2
  })

  render() {
    return (
      <div >
        <Container style={{ height: "2rem" }}>
          <Row className="parent">
            {this.state.bookList.map((book) => (
              <Col md="3" className="item">
                <Card key={book.bookId}>
                  <CardImg top width="10%" src={window.location.origin + '/logo192.png'} alt="Card image cap" />
                  <CardBody>
                    <CardTitle className="title" tag="h5">{book.bookName}</CardTitle>
                    <CardSubtitle tag="h6" className="mb-2 text-muted">{this.formatter.format(book.unitPrice)}</CardSubtitle>
                    <CardText></CardText>
                    <Button color="info">ADD TO CART</Button>
                  </CardBody>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </div >
    );
  }
};

export default CartItem;