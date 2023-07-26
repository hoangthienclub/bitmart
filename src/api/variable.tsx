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
};

const WS_URL = "wss://ws-manager-compress.bitmart.com/api?protocol=1.1";

const variables = {
    method,
    DEFAULT_PARAMS,
    apis,
    WS_URL

}
export default variables