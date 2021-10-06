import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button, Col, Container, Row
} from 'reactstrap';
import { formatter } from '../Formatter';
import './item.css'

const ProductList = ({ title, productList }) => {
  const history = useHistory();

  return (
    <div >
      <Container style={{ height: "2rem" }}>
        <Row className="parent">
          <h5>{title}</h5>
          {productList.map((product) => (
            <Col md="3" className="item" key={product.productId} style={{ cursor: "pointer" }}>
              <Card onClick={() => history.push(`/detail/` + product.productId)}>
                {(product.image === null || product.image === '')
                  ? <div><CardImg style={{ width: "100%" }, { height: "200px" }} src={window.location.origin + '/product-default.png'} /></div>
                  : <div><CardImg style={{ width: "100%" }, { height: "200px" }} src={`data:image/jpeg;base64,${product.image}`}></CardImg></div>}
                <CardBody>
                  <CardTitle className="title" tag="h5">{product.productName}</CardTitle>
                  <CardSubtitle tag="h6" className="mb-2 text-muted">{formatter.format(product.unitPrice)}</CardSubtitle>
                  <CardText></CardText>
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