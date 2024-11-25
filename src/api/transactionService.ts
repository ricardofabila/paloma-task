import {Transaction} from "../types/types";

const WEB_SOCKET_URL = `${import.meta.env.VITE_APP_BASE_WS_URL}`;

type WebSocketCallbacks = {
    onMessage: (transaction: Transaction) => void;
    onError: (error: Event) => void;
    onClose: () => void;
};


export const createTransactionWebSocket = (
    accountId: string,
    callbacks: WebSocketCallbacks,
    sinceTransactionId?: string
): { close: () => void } => {
    let wsUrl = `${WEB_SOCKET_URL}/accounts/${accountId}/transactions`;

    if (sinceTransactionId) {
        wsUrl += `?since=${sinceTransactionId}`;
    }

    let socket: WebSocket;
    let reconnectAttempts = 0;
    const maxReconnectAttempts = 5;
    let isClosedByClient = false;

    const connect = () => {
        socket = new WebSocket(wsUrl);

        socket.onopen = () => {
            console.log("WebSocket connection established");
            reconnectAttempts = 0;
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

            if (!isClosedByClient && reconnectAttempts < maxReconnectAttempts) {
                reconnectAttempts++;
                const timeout = Math.min(1000 * reconnectAttempts, 10000);
                setTimeout(() => {
                    console.log(`Attempting to reconnect (Attempt ${reconnectAttempts})...`);
                    connect();
                }, timeout);
            } else if (isClosedByClient) {
                console.log("WebSocket closed by client; not attempting to reconnect.");
            } else {
                console.error("Max reconnection attempts reached.");
            }
        };
    };

    connect();

    return {
        close: () => {
            isClosedByClient = true;
            socket.close();
        },
    };
};