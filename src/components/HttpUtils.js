import axios from "axios";

export const hostFrontend = 'http://localhost:3000/';
export const hostBackend = 'http://localhost:8080/api';

export const endpointUser = hostBackend;
export const endpointPublic = hostBackend + "/public";
export const endpointAuth = hostBackend + "/auth";

export function get(url) {
    return axios.get(url);
}

export function getWithAuth(url) {
    var config = {
        mode: "no-cors",
        headers: {
            'Access-Control-Allow-Origin': '*',
            "Content-Type": "application/json; charset=UTF-8",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    }
    return axios.get(url, config);
}

export function post(url, body) {
    // var params = { username: body.username, password: body.password }
    var config = {
        mode: "no-cors",
        headers: {
            'Access-Control-Allow-Origin': '*',
            "Content-Type": "application/json; charset=UTF-8"
        }
    }
    return axios.post(url, JSON.stringify(body), config);
}

export function postwithAuth(url, body) {
    var config = {
        mode: "no-cors",
        headers: {
            'Access-Control-Allow-Origin': '*',
            "Content-Type": "application/json; charset=UTF-8",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    }

    return axios.post(url, JSON.stringify(body), config);
}

export function putWithAuth(url, body) {
    var config = {
        mode: "no-cors",
        headers: {
            'Access-Control-Allow-Origin': '*',
            "Content-Type": "application/json; charset=UTF-8",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    }

    return axios.put(url, JSON.stringify(body), config);
}

export function deleteWithAuth(url) {
    var config = {
        mode: "no-cors",
        headers: {
            'Access-Control-Allow-Origin': '*',
            "Content-Type": "application/json; charset=UTF-8",
            "Authorization": "Bearer " + localStorage.getItem("token")
        }
    }

    return axios.delete(url, config);
}