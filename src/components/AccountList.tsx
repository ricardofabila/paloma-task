import React, {useEffect, useState} from "react";
import Fuse from 'fuse.js'
import {Account} from "../types/types";
import {Button} from "./ui/button";
import {Card} from "./ui/card";
import {Input} from "./ui/input";
import {Skeleton} from "./ui/skeleton"
import {useAccounts} from "../context/AccountsContext";


const AccountList: React.FC = () => {
    const {accounts, loading, error, setSelectedAccount} = useAccounts();
    const [filteredAccounts, setFilteredAccounts] = useState<Account[]>([]);
    const [searchBank, setSearchBank] = useState<Fuse<Account>>();

    useEffect(() => {
        setFilteredAccounts(accounts);
        const fuse = new Fuse(accounts, {keys: ["accountName"]});
        setSearchBank(fuse);
    }, [accounts]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (loading) {
        return <div>
            Loading accounts...
            <Skeleton className="w-[100px] h-[20px] rounded-full"/>
        </div>;
    }

    const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const needle = event.target.value;

        if (needle.trim() === "") {
            setFilteredAccounts(accounts);
            return;
        }

        const results = searchBank?.search(needle);
        setFilteredAccounts(results?.map((i) => i.item) ?? []);
    };

    return (
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-4">Accounts</h2>
            <Input placeholder="search" onChange={handleSearch}/>
            <br/>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAccounts.map((account) => (
                    <Card key={account.accountId} className="p-4">
                        <h3 className="text-xl font-semibold">{account.accountName}</h3>
                        <p>{account.email}</p>
                        <p>{account.phoneNumber}</p>
                        <p>
                            {account.address}, {account.country}
                        </p>
                        <Button
                            variant="default"
                            className="mt-2"
                            onClick={() => setSelectedAccount(account)}
                        >
                            View Transactions
                        </Button>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default AccountList;
