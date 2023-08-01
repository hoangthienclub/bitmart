const apis = {
  openOrders: "spot/v4/query/open-orders",
  orderHistory: "spot/v4/query/history-orders",
  allSymbol: "spot/v1/symbols/details",
  accountInfo: "account/v1/wallet",
  buy: "spot/v2/submit_order",
  placeBatchOrder: "spot/v2/batch_orders",
  cancelAllOrder: 'spot/v1/cancel_orders',
  cancel: `spot/v3/cancel_order`,
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