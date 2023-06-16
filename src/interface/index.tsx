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
    id: number;
    state: string;
    type: string;
    side: 'sell' | 'buy'
}

export interface IHistoryOrder {
    "account-id": number;
    currency: string;
    "record-id": number;
    "transact-amt": string;
    "transact-type": string;
    "avail-balance": string;
    "acct-balance": string;
    "transact-time": number;
}



export interface IOrder {

}