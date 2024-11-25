import React from "react";
import AccountList from "../components/AccountList";
import TransactionFeed from "../components/TransactionFeed";
import {useAccounts} from "../context/AccountsContext";

const Dashboard: React.FC = () => {
    const {error, selectedAccount} = useAccounts();

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div className="flex">
            <div className="w-2/3">
                <AccountList/>
            </div>
            <div className="w-1/3">{selectedAccount &&
                <TransactionFeed accountId={selectedAccount.accountId}
                                 accountName={selectedAccount.accountName}/>}
            </div>
        </div>
    );
};

export default Dashboard;
