import {useWebSocket} from "./useWebSocket"


// hooks/useAppSocket.ts 
export const useAppSocket = () => {
    const socket = useWebSocket('wss://your-url', {
        onOpen: () => console.log('Connected to WebSocket'),
        reconnectAttempts: 3
    });

    return {
        isConnected: socket.isConnected,
        subscribeToChatMessages: (callback) => socket.subscribe('chat', callback),
        subscribeToLogs: (callback) => socket.subscribe('logs', callback),
        sendChatMessage: (message) => socket.send('chat', message),
        sendQuery: (query) => socket.query(query)
    };
};