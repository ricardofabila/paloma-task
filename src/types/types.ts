export type Account = {
    accountId: string;
    accountName: string;
    currency: "USD" | "CAD" | "EUR" | "GBP" | "AUD" | "JPY";
    country: string;
    address: string;
    phoneNumber: string;
    email: string;
};

export type AccountResponse =
    | {
    data: Account[];
    error: null;
}
    | {
    data: null;
    error: string;
};

export type Transaction = {
    transactionId: string;
    direction: "inflow" | "outflow";
    amount: number;
    currency: "USD" | "CAD" | "EUR" | "GBP" | "AUD" | "JPY";
    destinationId: string;
    destinationName: string;
    sourceId: string;
    sourceName: string;
};


export type Filters = {
    minAmount?: number;
    maxAmount?: number;
    currencies: string[];
};