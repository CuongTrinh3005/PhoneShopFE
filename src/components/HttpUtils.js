import axios from "axios";

export const hostFrontend = 'http://localhost:3000/';
export const hostBackend = 'http://localhost:9081/';

export const endpointUser = hostBackend + "api/v1";
export const endpointPublic = hostBackend + "api/public";
export const endpointAuth = hostBackend + "api/auth";
// export const endpointUser = "http://localhost:9081/api/v1"
// export const endpointPublic = "http://localhost:9081/api/public"
// export const endpointAuth = "http://localhost:9081/api/auth"

export function get(url) {
    return axios.get(url);
}

export function getWithAuth(url) {
    var config = {
        mode: "no-cors",
        headers: {
            'Access-Control-Allow-Origin': '*',
            "Content-Type": "application/json; charset=UTF-8",
            "Authorization": "Bearer " + localStorage.getItem("accessToken")
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
            "Authorization": "Bearer " + localStorage.getItem("accessToken")
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
            "Authorization": "Bearer " + localStorage.getItem("accessToken")
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
            "Authorization": "Bearer " + localStorage.getItem("accessToken")
        }
    }

    return axios.delete(url, config);
}