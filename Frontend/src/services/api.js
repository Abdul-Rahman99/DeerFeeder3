import axios from "axios";

import {api as apiInfo} from '../config'

const apiPrefix = 'api'

export const api = axios.create({
    baseURL: `${apiInfo.API_URL}/${apiPrefix}`
})