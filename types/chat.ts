// types/chat.ts
export interface Chat {
    id: string;
    title: string;
    lastMessage?: string;
    createdAt: Date;
    updatedAt: Date;
}

export type ConversationType = 'default' | 'analyser' | 'webAnalyser';
export interface Conversation {
    id: number;
    name: string | null;
    session_id: string | null;
    user_input: string | null;
    bot_response: string | null;
    timestamp: Date;
    user_id: string | null;
    connection_id: string | null;
}

export interface Message {
    id: string;
    content: string;
    text?: string;
    sender: "user" | "assistant";
    timestamp: Date;
}

export interface WebSocketMessage {
    type: 'message' | 'file' | 'title_suggestion';
    content: string;
    sender: 'user' | 'assistant';
    session_id?: string;
    timestamp?: string;
    file_info?: {
        url: string;
        filename: string;
    };
}

export interface WebSocketOptions {
    reconnectAttempts?: number;
    reconnectInterval?: number;
    heartbeatInterval?: number;
    onOpen?: (event: WebSocketEventMap['open']) => void;
    onClose?: (event: WebSocketEventMap['close']) => void;
    onMessage?: (event: WebSocketEventMap['message']) => void;
    onError?: (event: WebSocketEventMap['error']) => void;
    protocols?: string | string[];
}

export interface ChatInterfaceProps {
    chatId?: string;
    userId: string;
    onNewChat?: (chatId: string, title: string) => void;
}

export interface PresignedUrlResponse {
    uploadUrl: string;
    fileUrl: string;
    fields?: Record<string, string>;
}

export interface SessionItem {
    id: string;
    name: string;
    sessionType: string;
    connectionId: string | undefined;
    analyserId: string | undefined;
}