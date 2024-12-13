// hooks/useChatSocket.ts
import {useWebSocket} from "./useWebSocket";
import * as uuid from 'uuid';
export const useChatSocket = (userId: string, sessionId: string) => {
    const socket = useWebSocket(
        `${process.env.NEXT_PUBLIC_PYTHON_WS_URL}/ws/query?token=${uuid.v4()}`,
        {
            onOpen: () => console.log('Connected to chat'),
            onMessage: (event) => console.log('Messages from chat', event),
            onError: (error) => console.log('WebSocket error:', error)
        }
    );

    const sendMessage = (message: string) => {
        socket.emit({
            query: message,
            sessionId,
            userId,
            sessionType: 'default',
            name: ""
        });
    };

    const subscribeToMessages = (callback: (message: any) => void) => {
        return socket.on('', callback);
    };

    return {
        isConnected: socket.isConnected,
        sendMessage,
        subscribeToMessages
    };
};

