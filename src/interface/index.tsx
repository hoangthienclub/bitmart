export interface ISymbol {
  "base-currency": string;
  "quote-currency": string;
  "price-precision": number;
  "amount-precision": number;
  "symbol-partition": string;
  symbol: string;
  state: string;
  "value-precision": number;
  "min-order-amt": number;
  "max-order-amt": number;
  "min-order-value": number;
  "limit-order-min-order-amt": number;
  "limit-order-max-order-amt": number;
  "limit-order-max-buy-amt": number;
  "limit-order-max-sell-amt": number;
  "buy-limit-must-less-than": number;
  "sell-limit-must-greater-than": number;
  "sell-market-min-order-amt": number;
  "sell-market-max-order-amt": number;
  "buy-market-max-order-value": number;
  "market-sell-order-rate-must-less-than": number;
  "market-buy-order-rate-must-less-than": number;
  "api-trading": string;
  tags: string;
}

export interface IOpenOrder {
  symbol: string;
  source: string;
  price: string;
  "created-at": number;
  amount: string;
  "account-id": number;
  "filled-cash-amount": string;
  "client-order-id": string;
  "filled-amount": string;
  "filled-fees": string;
  id: number | string;
  state: string;
  type: "sell-limit" | "buy-limit";
}

export interface IHistoryOrder {
  id: number;
  symbol: string;
  "account-id": number;
  "client-order-id": "";
  amount: number;
  price: number;
  "created-at": number;
  "updated-at": number;
  type: string;
  "field-amount": number;
  "field-cash-amount": number;
  "field-fees": number;
  "finished-at": number;
  source: string;
  state: string;
  "canceled-at": number;
}

export interface IBalance {
  currency: string;
  type: string;
  balance: number;
  available: number;
  debt: number;
  "seq-num": number;
}

export interface IOrder {}
