import moment from "moment";

const host = 'api.huobi.pro';
const apis = {
  openOrders: "/v1/order/openOrders",
  orderHistory: "/v1/order/history",
  allSymbol: "/v1/common/symbols",
  accountInfo: "/v1/account/accounts",
  buy: "/v1/order/orders/place",
  cancelAllOrder: '/v1/order/orders/batchCancelOpenOrders',
  cancel: (orderId: string) => `/v1/order/orders/${orderId}/submitcancel`,
};
const method = 'GET';

const timestamp = moment().utc().format('YYYY-MM-DDTHH:mm:ss');

const DEFAULT_PARAMS = {
    'SignatureMethod': 'HmacSHA256',
    'SignatureVersion': '2',
    'Timestamp': timestamp,
    // 'AccessKeyId': access_key_id,
    // "account-id": "57139968",
    // "symbol": "btcusdt",
    // "side": "buy" //sell
};
const WS_URL = "wss://www.huobi.com/-/s/pro/ws";

const variables = {
    method,
    DEFAULT_PARAMS,
    apis,
    host,
    WS_URL

}
export default variables