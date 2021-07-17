import React, { Component } from 'react';
import { useParams, withRouter } from 'react-router-dom';

var queryString = require('query-string')
console.log("Search location: ", queryString.parse(window.location.search))
console.log("name: ", queryString.parse(window.location.search).name)
console.log("password: ", queryString.parse(window.location.search).password)

class HelloWord extends Component {
    state = {}
    render() {
        // return (<h1>Hello World, {formatter(user)}</h1>);
        return (<h1>Hello World, {this.props.match.params.username}</h1>);
    }
}

function formatter(user) {
    return user.firstname + ' ' + user.lastname;
};
var user = {
    firstname: "Trinh",
    lastname: "Cuong"
}

export default withRouter(HelloWord);