import moment from "moment";
const API_KEY = '286e00c507f81f10c8b95b894a30d30e0202c242';
const API_SECRET = '438f119328aa872b0d9260162625d49027798eb43d6f07f390400800c747f891';
const API_MEMO = 'Test';

const BASE_URL = 'https://api-cloud.bitmart.com';
function get_timestamp() {
  return new Date().getTime().toString();
}

const host = 'api.huobi.pro';
const apis = {
  openOrders: "spot/v4/query/open-orders",
  orderHistory: "spot/v4/query/history-orders",
  allSymbol: "spot/v1/symbols/details",
  accountInfo: "account/v1/wallet",
  buy: "/v1/order/orders/place",
  placeBatchOrder: "/v1/order/batch-orders",
  cancelAllOrder: '/v1/order/orders/batchCancelOpenOrders',
  cancel: (orderId: string) => `/v1/order/orders/${orderId}/submitcancel`,
};
const method = 'GET';


const DEFAULT_PARAMS = {
    'Content-Type': 'application/json',
    'X-BM-KEY': API_KEY,
    'X-BM-TIMESTAMP': get_timestamp(),
};
const WS_URL = "wss://ws-manager-compress.bitmart.com/api?protocol=1.1";

const variables = {
    method,
    DEFAULT_PARAMS,
    apis,
    host,
    WS_URL

}
export default variables