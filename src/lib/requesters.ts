import axios from 'axios'
import { getHankoToken } from '@/helpers/hanko-helpers'

const tradesMenRequest = axios.create({
    baseURL: process.env.APP_URI,
    withCredentials: true,
})

tradesMenRequest.interceptors.request.use(async (config) => {
    const [hankoToken] = await Promise.all([
        getHankoToken(),
    ])

    if (hankoToken) config.headers['hanko-token'] = hankoToken

    return config
})

export default tradesMenRequest
