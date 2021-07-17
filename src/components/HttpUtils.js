import axios from "axios";

export const endpointUser = "https://jsonplaceholder.typicode.com"
export const endpointPublic = "http://localhost:9081/api/public"

export function get(url) {
    return axios.get(url);
}