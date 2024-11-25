type Filters = {
    minAmount?: number;
    maxAmount?: number;
    currencies: string[];
};

const SELECTED_ACCOUNT_KEY = "selectedAccountId";
const TRANSACTION_FILTERS_KEY = "transactionFilters";

// i am using typescript so this function safely parses JSON to a type
const safeJSONParse = <T>(value: string | null): T | null => {
    if (!value) return null;
    try {
        return JSON.parse(value) as T;
    } catch (e) {
        console.error("Failed to parse JSON from localStorage", e);
        return null;
    }
};

export const getSelectedAccountId = (): string | null => {
    return localStorage.getItem(SELECTED_ACCOUNT_KEY);
};

export const setSelectedAccountId = (accountId: string | null): void => {
    if (accountId) {
        localStorage.setItem(SELECTED_ACCOUNT_KEY, accountId);
    } else {
        localStorage.removeItem(SELECTED_ACCOUNT_KEY);
    }
};

export const getTransactionFilters = (): Filters => {
    const filters = safeJSONParse<Filters>(
        localStorage.getItem(TRANSACTION_FILTERS_KEY)
    );
    return filters || {currencies: []};
};

export const setTransactionFilters = (filters: Filters): void => {
    localStorage.setItem(TRANSACTION_FILTERS_KEY, JSON.stringify(filters));
};

