// hooks/useWebSocket.ts
import { useState, useEffect, useRef, useCallback } from 'react';

interface WebSocketOptions {
    reconnectAttempts?: number;
    reconnectInterval?: number;
    heartbeatInterval?: number;
    onOpen?: (event: WebSocketEventMap['open']) => void;
    onClose?: (event: WebSocketEventMap['close']) => void;
    onError?: (event: WebSocketEventMap['error']) => void;
    protocols?: string | string[];
}

type MessageHandler = (message: any) => void;

interface WebSocketMessage {
    type: string;
    payload: any;
}

export function useWebSocket(url: string, options: WebSocketOptions = {}) {
    const [isConnected, setIsConnected] = useState(false);
    const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
    const webSocketRef = useRef<WebSocket | null>(null);
    const reconnectAttemptsRef = useRef(0);
    const messageHandlersRef = useRef<Map<string, Set<MessageHandler>>>(new Map());
    const reconnectTimeoutRef = useRef<NodeJS.Timeout>();

    const {
        reconnectAttempts = 5,
        reconnectInterval = 3000,
        heartbeatInterval = 30000,
        onOpen,
        onClose,
        onError,
        protocols,
    } = options;

    // Initialize WebSocket connection
    const connect = useCallback(() => {
        try {
            webSocketRef.current = new WebSocket(url, protocols);
            initializeWebSocket();
        } catch (error) {
            console.error('WebSocket connection error:', error);
            handleReconnect();
        }
    }, [url, protocols]);

    // Initialize WebSocket event handlers
    const initializeWebSocket = useCallback(() => {
        if (!webSocketRef.current) return;

        webSocketRef.current.onopen = (event) => {
            setIsConnected(true);
            reconnectAttemptsRef.current = 0;
            onOpen?.(event);
            startHeartbeat();
        };

        webSocketRef.current.onclose = (event) => {
            setIsConnected(false);
            onClose?.(event);
            handleReconnect();
        };

        webSocketRef.current.onerror = (event) => {
            onError?.(event);
        };

        webSocketRef.current.onmessage = (event) => {
            try {
                const message: WebSocketMessage = JSON.parse(event.data);
                setLastMessage(message);
                handleMessage(message);
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };
    }, [onOpen, onClose, onError]);

    // Reconnection logic
    const handleReconnect = useCallback(() => {
        if (
            reconnectAttemptsRef.current < reconnectAttempts &&
            !reconnectTimeoutRef.current
        ) {
            reconnectTimeoutRef.current = setTimeout(() => {
                reconnectAttemptsRef.current += 1;
                connect();
                reconnectTimeoutRef.current = undefined;
            }, reconnectInterval);
        }
    }, [reconnectAttempts, reconnectInterval, connect]);

    // Heartbeat to keep connection alive
    const startHeartbeat = useCallback(() => {
        const interval = setInterval(() => {
            if (webSocketRef.current?.readyState === WebSocket.OPEN) {
                webSocketRef.current.send(JSON.stringify({ type: 'ping' }));
            }
        }, heartbeatInterval);

        return () => clearInterval(interval);
    }, [heartbeatInterval]);

    // Message handling
    const handleMessage = useCallback((message: WebSocketMessage) => {
        const handlers = messageHandlersRef.current.get(message.type);
        if (handlers) {
            handlers.forEach((handler) => {
                try {
                    handler(message.payload);
                } catch (error) {
                    console.error('Error in message handler:', error);
                }
            });
        }
    }, []);

    // Subscribe to message types
    const subscribe = useCallback((type: string, handler: MessageHandler) => {
        if (!messageHandlersRef.current.has(type)) {
            messageHandlersRef.current.set(type, new Set());
        }
        messageHandlersRef.current.get(type)!.add(handler);

        return () => {
            const handlers = messageHandlersRef.current.get(type);
            if (handlers) {
                handlers.delete(handler);
                if (handlers.size === 0) {
                    messageHandlersRef.current.delete(type);
                }
            }
        };
    }, []);

    // Send message helper
    const send = useCallback((type: string, payload: any) => {
        if (webSocketRef.current?.readyState === WebSocket.OPEN) {
            webSocketRef.current.send(JSON.stringify({ type, payload }));
        } else {
            console.warn('WebSocket is not connected');
        }
    }, []);

    // Initial connection
    useEffect(() => {
        connect();

        return () => {
            if (reconnectTimeoutRef.current) {
                clearTimeout(reconnectTimeoutRef.current);
            }
            if (webSocketRef.current) {
                webSocketRef.current.close();
            }
        };
    }, [connect]);

    return {
        isConnected,
        lastMessage,
        subscribe,
        send,
        // Helper methods
        on: subscribe,
        emit: send,
    };
}