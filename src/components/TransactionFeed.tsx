import React, {useEffect, useState} from "react";
import {Filters, Transaction} from "../types/types";
import {createTransactionWebSocket} from "../api/transactionService";
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from "./ui/table";
import {Input} from "./ui/input";
import {Checkbox} from "./ui/checkbox";
import {Button} from "./ui/button";
import {
    getTransactionFilters,
    setTransactionFilters,
} from "../services/storageService";

type Props = {
    accountId: string;
    accountName: string;
};


const TransactionFeed: React.FC<Props> = ({accountId, accountName}) => {
    const [allTransactions, setAllTransactions] = useState<Transaction[]>([]);
    const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
    const [filters, setFilters] = useState<Filters>(() => {
        return getTransactionFilters();
    });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const callbacks = {
            onMessage: (transaction: Transaction) => {
                setAllTransactions((prev) => [transaction, ...prev]);

                if (error) {
                    setError(null);
                }
            },
            onError: (event: Event) => {
                setError("WebSocket error occurred");
                console.error(event)
            },
            onClose: () => {
                console.log("WebSocket connection closed");
                // set transactions to empty to not mix different account transactions
                setAllTransactions([]);
            },
        };

        const {close} = createTransactionWebSocket(accountId, callbacks);

        // Cleanup on unmount
        return () => {
            close();
        };
    }, [accountId]);

    useEffect(() => {
        let transactions = allTransactions;

        if (filters.minAmount !== undefined) {
            transactions = transactions.filter(
                (txn) => txn.amount >= filters.minAmount!
            );
        }

        if (filters.maxAmount !== undefined) {
            transactions = transactions.filter(
                (txn) => txn.amount <= filters.maxAmount!
            );
        }

        if (filters.currencies.length > 0) {
            transactions = transactions.filter((txn) =>
                filters.currencies.includes(txn.currency)
            );
        }

        setTransactionFilters(filters);
        setFilteredTransactions(transactions);
    }, [filters, allTransactions]);

    const handleFilterChange = (field: string, value: string) => {
        setFilters((prev) => ({
            ...prev,
            [field]: value ? parseFloat(value) : undefined,
        }));
    };

    const handleCurrencyToggle = (currency: string) => {
        console.log(currency)
        setFilters((prev) => {
            const currencies = prev.currencies.includes(currency)
                ? prev.currencies.filter((c) => c !== currency)
                : [...prev.currencies, currency];
            return {...prev, currencies};
        });
    };

    const resetFilters = () => {
        setFilters({
            currencies: [],
            minAmount: undefined,
            maxAmount: undefined,
        });
    };

    if (!accountId) {
        return null;
    }

    return (
        <div className="mt-8">
            <h3 className="text-2xl font-medium mb-4">
                Real-Time Transactions for Account of <br/>
                <b>{accountName}</b>
            </h3>

            <div className="mb-4">
                <h4 className="text-lg font-semibold mb-2">Filter Transactions</h4>
                <div className="flex flex-wrap gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Min Amount</label>
                        <Input
                            type="number"
                            value={filters.minAmount !== undefined ? filters.minAmount : ""}
                            onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                            placeholder="Minimum amount"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Max Amount</label>
                        <Input
                            type="number"
                            value={filters.maxAmount !== undefined ? filters.maxAmount : ""}
                            onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                            placeholder="Maximum amount"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Currencies</label>
                        <div className="flex flex-wrap gap-2 mt-1">
                            {["USD", "CAD", "EUR", "GBP", "AUD", "JPY"].map((currency) => (
                                <label key={currency} className="inline-flex items-center">
                                    <Checkbox
                                        checked={filters.currencies.includes(currency)}
                                        onClick={() => handleCurrencyToggle(currency)}
                                    />
                                    <span className="ml-2">{currency}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
                <Button className="mt-4" onClick={resetFilters}>
                    Reset Filters
                </Button>
            </div>

            {error && <div className="text-red-500">{error}</div>}

            {filteredTransactions.length === 0 && (
                <p className="text-center">No transactions for this account match the filters</p>
            )}

            {filteredTransactions.length > 0 && (
                <Table className="min-w-full">
                    <TableHeader>
                        <TableRow>
                            <TableHead>Direction</TableHead>
                            <TableHead>Amount</TableHead>
                            <TableHead>Currency</TableHead>
                            <TableHead>Destination</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredTransactions.map((txn, index) => (
                            <TableRow key={txn.transactionId + index}>
                                <TableCell>{txn.direction}</TableCell>
                                <TableCell>{txn.amount}</TableCell>
                                <TableCell>{txn.currency}</TableCell>
                                <TableCell>{txn.destinationName}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            )}
        </div>
    );
};

export default TransactionFeed;
