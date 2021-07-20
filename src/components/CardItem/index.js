import React, { Component } from 'react';
import { Link } from 'react-router-dom';
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

  componentDidUpdate() {
    if (this.props.categoryName !== '')
      this.fetchBookByCategoryName(this.props.categoryName)
  }

  fetchAllPublicBooks() {
    get(endpointPublic + "/books").then((response) => {
      if (response.status === 200) {
        this.setState({ bookList: response.data })
        console.log("Books: ", response.data)
      }
    })
  }

  fetchBookByCategoryName(categoryName) {
    get(endpointPublic + "/books/search/category?name=" + categoryName).then((response) => {
      if (response.status === 200) {
        this.setState({ bookList: response.data })
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
            {this.props.categoryName !== '' ? <h5>Books of {this.props.categoryName}</h5> : <h5>ALL BOOKS</h5>}
            {/* {(!Array.isArray(this.state.bookList)) & <h5>NO BOOKS FOUND</h5>} */}
            {this.state.bookList.map((book) => (
              <Col md="3" className="item" key={book.bookId}>
                <Card>
                  {/* <CardImg top width="10%" src={window.location.origin + '/logo192.png'} alt="Card image cap" /> */}
                  {book.photo === null
                    ? <div><CardImg style={{ width: "100px" }, { height: "100px" }} src={window.location.origin + '/logo192.png'} alt="Card image cap" /></div>
                    : <div><CardImg style={{ width: "100px" }, { height: "100px" }} src={`data:image/jpeg;base64,${book.photo}`} alt="Loading..."></CardImg></div>}

                  <CardBody>
                    <CardTitle className="title" tag="h5">{book.bookName}</CardTitle>
                    <CardSubtitle tag="h6" className="mb-2 text-muted">{this.formatter.format(book.unitPrice)}</CardSubtitle>
                    <CardText></CardText>
                    <Link to={{ pathname: `/detail/` + book.bookId }}>
                      <Button color="info">View details</Button>
                    </Link>

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