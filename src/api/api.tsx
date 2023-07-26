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

const getAllSymbol = () => {
  return baseApi({ url: apis.allSymbol, params: {} })
}
const getUserInfo = ({
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
  console.log("type===========>", AccessKeyId, secretKey, type);
  
  return baseApi({
    url: apis.accountInfo,
    userKey: { AccessKeyId, secretKey, userName },
    // isLogin: true,
  });
};

const getHistoryOrder = (userKey: any, body: any) => {
  return baseApi({ url: apis.orderHistory, method: "POST", body: {}, userKey })
}
const getOpenOrder = (userKey: any, body: any) => {
  return baseApi({ url: apis.openOrders, method: "POST", body: {}, userKey })
}

const getAccountBalance = ({
  userId,
  AccessKeyId,
  secretKey,
}: {
  userId: string;
  AccessKeyId: string;
  secretKey: string;
}) => {
  return baseApi({
    url: `${apis.accountInfo}/${userId}/balance`,
    params: { AccessKeyId, secretKey },
  });
};

const buyOrder = (params: ISellBuy) => {
  return baseApi({ url: apis.buy, method: "POST", params: { ...params, type: "buy-limit" } });
};

const sellOrder = (params: ISellBuy) => {
  return baseApi({ url: apis.buy, method: "POST", params: { ...params, type: "sell-limit" } });
};

const sellBatchOrder = (params: ISellBuy[]) => {
  return baseApi({ url: apis.placeBatchOrder, method: "POST", params });
};

const cancelOrder = ({ orderId, symbol }: { orderId: string; symbol: string }) => {
  return baseApi({
    url: apis.cancel(orderId),
    method: "POST",
    params: { symbol, "order-id": orderId },
  });
};

const cancelAllOrder = ({ symbol, userId, size, side, types, AccessKeyId, secretKey }: {
  symbol: string, userId: string, types: 'sell-limit' | 'buy-limit', side: 'sell' | 'buy', size?: number, AccessKeyId: string;
  secretKey: string;
}) => {
  return baseApi({
    url: apis.cancelAllOrder,
    method: "POST",
    params: { symbol, 'account-id': userId, size, side, types, AccessKeyId, secretKey },
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