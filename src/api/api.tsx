import baseApi from "./baseApi"
import variables from "./variable"
const { apis } = variables

const getAllSymbol = () => {
    return baseApi({ url: apis.allSymbol, params: {} })
}
const getUserInfo = ({ accessKey, secretKey }: { accessKey: string, secretKey: string }) => {
    return baseApi({ url: apis.accountInfo, params: { AccessKeyId: accessKey, secretKey } })
}

const getHistoryOrder = (params: any) => {
    return baseApi({ url: apis.orderHistory, params })
}
const getOpenOrder = (params: any) => {
    return baseApi({ url: apis.openOrders, params })
}

const getAccountBalance = (userId:string) => {
    return baseApi({ url: `${apis.accountInfo}/${userId}/balance` })
}


const API = {
    getAllSymbol,
    getUserInfo,
    getHistoryOrder,
    getOpenOrder,
    getAccountBalance
}

export default API