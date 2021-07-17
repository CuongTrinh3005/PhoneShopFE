import React, { Component } from 'react';
import { ListGroup, ListGroupItem } from 'reactstrap';
import { endpointPublic, get } from '../HttpUtils';

class Aside extends Component {
    render() {
        return (
            <div>
                <br />
                <br />
                <br />

                <h6>ON YOUR CHOICE</h6>
                <ListGroup>
                    <ListGroupItem>Best Seller</ListGroupItem>
                    <ListGroupItem>On Sale</ListGroupItem>
                    <ListGroupItem>Top View</ListGroupItem>
                    <ListGroupItem>New book </ListGroupItem>
                </ListGroup>
            </div>
        );
    }
}

export default Aside;