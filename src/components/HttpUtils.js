import axios from "axios";

export const endpointUser = "http://localhost:9081/api/v1"
export const endpointPublic = "http://localhost:9081/api/public"
export const endpointAuth = "http://localhost:9081/api/auth"

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

// export function post(url, body) {
//     return axios.post(url, {
//         method: 'POST',
//         body: JSON.stringify({
//             // id: id,  
//             // title: post.title,
//             // body: post.body,
//             // userId: 1
//             username: body.username,
//             password: body.password
//         }),
//         headers: {
//             "Content-type": "application/json; charset=UTF-8",
//             'Accept': 'application/json',
//             'Origin': 'http://localhost:3000',
//             'Access-Control-Allow-Origin': 'http://localhost:3000',
//             'Access-Control-Allow-Credentials': 'true'
//         }
//     })
// }

export function post(url, body) {
    // var params = { username: body.username, password: body.password }
    var config = {
        mode: "no-cors",
        headers: {
            // "X-RapidAPI-Host": "hackerrank-hackerrank.p.rapidapi.com",
            // "X-RapidAPI-Key": "a72a0f1b5dmshdc3f55e233876eap1b8939jsnffad2a5b6e6e",
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