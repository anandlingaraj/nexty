'use client';
import { ChatInterfaceProps, Message, SessionItem } from "@/types/chat";
import {useCallback, useEffect, useState } from "react";
import { TopMenuBar } from "../layout/top-menubar";
import { uploadFileToS3 } from "@/lib/api";
import { ChatInput } from "./ChatInput";
import { MessageBubble } from "./MessageBubble";
import { ConnectionStatus } from "./ConnectionStatus";
import { LoadingIndicator } from "./LoadingIndicator";
import { useWebSocket } from '@/hooks/useWebSocket';
import { ReadyState } from "react-use-websocket";
import { SessionProvider } from "next-auth/react";
export default function ChatInterface(props: ChatInterfaceProps) {
  const [inputMessage, setInputMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string>(props.chatId || "cc5bfcc7-c84f-4482-a7b1-4b763fa2d27b");
  const [errorMessage, setErrorMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentSession, setCurrentSession] = useState<SessionItem>({
    id: '',
    name: '',
    sessionType: 'default',
    connectionId: undefined,
    analyserId: undefined,
  });

  // ${props.userId}-${sessionId}
  const { isConnected, send, query, on,emit } = useWebSocket(
      `${process.env.NEXT_PUBLIC_PYTHON_WS_URL}/ws/query?token=da02204b-5832-42ab-b1a2-72aef8524c23`,
      {
        onOpen: () => console.log('Connected to chat'),
        onMessage:(event) =>console.log('Messages from chat', event),
        onClose: () => console.log('Disconnected from chat'),
        onError: (error) => console.error('WebSocket error:', error)
      }
  );

  useEffect(() => {
    console.log("Current messages:", messages);
  }, [messages]);

  const handleChatMessage = useCallback((payload: any) => {
    console.log("Handling chat message:", payload);
    try {
      let messageData = payload;
      if (typeof payload === 'string') {
        messageData = JSON.parse(payload);
      }

      if (messageData.response) {
        console.log("Adding assistant message:", messageData.response);
        setMessages(prevMessages => [
          ...prevMessages,
          {
            id: `assistant-${Date.now()}`,
            content: messageData.response,
            sender: "assistant",
            timestamp: new Date(),
          }
        ]);
      }
    } catch (error) {
      console.error("Error handling message:", error);
    }
  }, []);


  useEffect(() => {
    const unsubscribe = on('', handleChatMessage);
    return () => {
      if (unsubscribe) {
        console.log("Cleaning up WebSocket subscription");
        unsubscribe();
      }
    };
  }, [on, handleChatMessage]);

  useEffect(() => {
    console.log("Current messages:", messages);
  }, [messages]);
  
  const handleSendMessage = async () => {
    if (!inputMessage.trim() && currentSession.id) return;
    setInputMessage('');
    try {
      // Add user message to UI immediately
      const userMessage: Message = {
        id: `user-${Date.now()}`,
        content: inputMessage,
        sender: "user",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);

      // Send through WebSocket
      emit({
        query: inputMessage,
        // sender: 'user',
        sessionId: sessionId,
        // connectionId: currentSession.connectionId,
        // analyserId:currentSession.analyserId,
        userId: props.userId,
        sessionType: currentSession.sessionType,
        name:"Sagittarius",
        // docName: ''
      });

      setInputMessage("");
    } catch (err) {
      console.error('Failed to send message:', err);
      setErrorMessage('Failed to send message');
    }
  };

  const handleCopyMessage = (content: string) => {
    navigator.clipboard.writeText(content);
  };


  const handleFileUpload = async (files: FileList) => {
    try {
      setLoading(true);
      const fileUrl = await uploadFileToS3(files[0], props.userId);

      // Send file message through WebSocket
      send('file_message', {
        content: `File uploaded: ${files[0].name}`,
        sender: 'user',
        session_id: sessionId,
        file_info: {
          url: fileUrl,
          filename: files[0].name
        }
      });
    } catch (err) {
      console.error('Failed to upload file:', err);
      setErrorMessage('Failed to upload file');
    } finally {
      setLoading(false);
    }
  };

  


  return (
      <div className="relative flex h-screen flex-col">
        <SessionProvider>
        <TopMenuBar />
        </SessionProvider>
        <div className="relative flex flex-1 flex-col overflow-hidden mt-4">
          <ConnectionStatus readyState={isConnected ? ReadyState.OPEN : ReadyState.CLOSED}/>
          <LoadingIndicator loading={loading}/>
          <div className="flex-1 overflow-y-auto space-y-8">
            {messages.map((message) => (
                <MessageBubble
                    key={message.id}
                    message={message}
                    onCopy={handleCopyMessage}
                />
            ))}
          </div>

          <ChatInput
              value={inputMessage}
              userId={props.userId}
              onChange={setInputMessage}
              onSend={handleSendMessage}
              onFileUpload={handleFileUpload}
              onError={(error) => setErrorMessage(error)}
          />
        </div>
      </div>
  );
}