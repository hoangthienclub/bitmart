export interface ISymbol {
  symbol: string
  symbol_id: number
  base_currency: string
  quote_currency: string
  quote_increment: string
  base_min_size: string
  price_min_precision: number
  price_max_precision: number
  expiration: string
  min_buy_amount: string
  min_sell_amount: string
  trade_status: string
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
