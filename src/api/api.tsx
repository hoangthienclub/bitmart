import baseApi from "./baseApi"
import variables from "./variable"
const { apis } = variables
interface ISellBuy {
  symbol: string;
  price: number;
  amount: number;
  AccessKeyId: string;
  secretKey: string;
  "account-id": string;
}

const getAllSymbol = (params?: any) => {
  return baseApi({ url: apis.allSymbol, params })
}
const getUserInfo = async ({
  AccessKeyId,
  secretKey,
  type,
  userName,
}: {
  AccessKeyId: string;
  secretKey: string;
  type: string;
  userName: string;
}) => {
  await baseApi({
    method: "POST",
    url: apis.openOrders,
    params: { AccessKeyId, secretKey, userName },
  })
  return baseApi({
    url: apis.accountInfo,
    params: { AccessKeyId, secretKey, userName },
  });
};

const getHistoryOrder = (params: { body?: any, userInfo: any }) => {
  return baseApi({ url: apis.orderHistory, method: "POST", body: {}, params: params.userInfo })
}
const getOpenOrder = (params: { body?: any, userInfo: any }) => {
  return baseApi({ url: apis.openOrders, method: "POST", body: {}, params: params.userInfo })
}

const getAccountBalance = (params: { body?: any, userInfo: any }) => {
  return baseApi({
    url: apis.accountInfo,
    params: params.userInfo
  });
};

const buyOrder = (params: { body: any, userInfo: any }) => {
  return baseApi({ url: apis.buy, method: "POST", body: params.body, params: params.userInfo });
};

const sellOrder = (params: ISellBuy) => {
  return baseApi({ url: apis.buy, method: "POST", params: { ...params, type: "sell-limit" } });
};

const sellBatchOrder = (params: { body: any, userInfo: any }) => {
  console.log({params})
  return baseApi({ url: apis.placeBatchOrder, method: "POST", body: params.body, params: params.userInfo });
};

const cancelOrder = (params: { body: any, userInfo: any }) => {
  return baseApi({
    url: apis.cancel,
    method: "POST",
    body: params.body, params: params.userInfo 
  });
};

const cancelAllOrder = (params: { body: any, userInfo: any }) => {
  return baseApi({
    url: apis.cancelAllOrder,
    method: "POST",
    body: params.body, params: params.userInfo 
  });
};


const API = {
  getAllSymbol,
  getUserInfo,
  getHistoryOrder,
  getOpenOrder,
  getAccountBalance,
  buyOrder,
  sellOrder,
  cancelOrder,
  cancelAllOrder,
  sellBatchOrder,
}

export default API