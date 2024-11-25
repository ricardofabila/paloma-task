import {Transaction} from "../types/types";

const WEB_SOCKET_URL = `${import.meta.env.VITE_APP_BASE_WS_URL}`;

type WebSocketCallbacks = {
    onMessage: (transaction: Transaction) => void;
    onError: (error: Event) => void;
    onClose: () => void;
};

export const createTransactionWebSocket = (
    accountId: string,
    callbacks: WebSocketCallbacks
): { close: () => void } => {
    const wsUrl = WEB_SOCKET_URL + `/accounts/${accountId}/transactions`;

    const socket = new WebSocket(wsUrl);

    socket.onopen = () => {
        console.log("WebSocket connection established");
    };

    socket.onmessage = (event) => {
        const transaction: Transaction = JSON.parse(event.data);
        callbacks.onMessage(transaction);
    };

    socket.onerror = (event) => {
        console.error("WebSocket error:", event);
        callbacks.onError(event);
    };

    socket.onclose = () => {
        console.log("WebSocket connection closed");
        callbacks.onClose();
    };

    return {
        close: () => {
            socket.close();
        },
    };
};
