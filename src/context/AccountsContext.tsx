import React, {createContext, useContext, useEffect, useState} from "react";
import {Account} from "../types/types";
import {fetchAccounts} from "../api/accounts";
import {getSelectedAccountId, setSelectedAccountId} from "../services/storageService";

type AccountsContextType = {
    selectedAccount?: Account;
    setSelectedAccount: (account: Account) => void;
    accounts: Account[];
    loading: boolean;
    error: string | null;
};

const AccountsContext = createContext<AccountsContextType | undefined>(undefined);

export const AccountsProvider: React.FC<{ children: React.ReactNode }> = ({children}) => {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedAccount, setSelectedAccountState] = useState<Account>();

    useEffect(() => {
        const getAccounts = async () => {
            try {
                const response = await fetchAccounts();
                if (response.error) {
                    setError(response.error);
                } else {
                    setAccounts(response.data ?? []);
                }
            } catch (err) {
                setError("Failed to fetch accounts");
            } finally {
                setLoading(false);
            }
        };

        getAccounts();
    }, []);

    useEffect(() => {
        const selectedAccountId = getSelectedAccountId();
        if (selectedAccountId) {
            const accountExists = accounts.find(
                (account) => account.accountId === selectedAccountId
            );
            setSelectedAccount(accountExists)
        }
    }, [accounts]);

    const setSelectedAccount = (account?: Account) => {
        setSelectedAccountState(account);
        if (account) {
            // this is the local storage set
            setSelectedAccountId(account.accountId)
        }
    };

    return (
        <AccountsContext.Provider value={{selectedAccount, setSelectedAccount, accounts, loading, error}}>
            {children}
        </AccountsContext.Provider>
    );
};

export const useAccounts = (): AccountsContextType => {
    const context = useContext(AccountsContext);
    if (context === undefined) {
        throw new Error("useAccounts must be used within an AccountsProvider");
    }
    return context;
};
