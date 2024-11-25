import React from 'react';
import Dashboard from './pages/Dashboard';
import {AccountsProvider} from "./context/AccountsContext";
import Header from "./components/Header";


const App: React.FC = () => {
    return (
        <AccountsProvider>
            <div className="w-full">
                <Header/>
            </div>
            <Dashboard/>
        </AccountsProvider>
    );
};

export default App;
