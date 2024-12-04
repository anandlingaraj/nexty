// app/components/chat/chat-interface.tsx
'use client';

import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Send } from "lucide-react";

interface Message {
    id: string;
    content: string;
    sender: 'user' | 'assistant';
    timestamp: Date;
}

interface ChatInterfaceProps {
    chatId: string;
}
export default function ChatInterface({ chatId }: ChatInterfaceProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputMessage, setInputMessage] = useState('');

    const handleSendMessage = () => {
        if (!inputMessage.trim()) return;

        const newMessage: Message = {
            id: Date.now().toString(),
            content: inputMessage,
            sender: 'user',
            timestamp: new Date(),
        };

        setMessages(prev => [...prev, newMessage]);
        setInputMessage('');

        // Simulate assistant response
        setTimeout(() => {
            const assistantMessage: Message = {
                id: (Date.now() + 1).toString(),
                content: "Thanks for your message! This is a simulated response.",
                sender: 'assistant',
                timestamp: new Date(),
            };
            setMessages(prev => [...prev, assistantMessage]);
        }, 1000);
    };

    return (
        <Card className="flex h-full flex-col">
            <div className="flex items-center space-x-4 p-4">
                <Avatar>
                    <AvatarImage src="/assistant-avatar.png" />
                    <AvatarFallback>AI</AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="text-lg font-semibold">AI Assistant</h2>
                    <p className="text-sm text-gray-500">Always here to help</p>
                </div>
            </div>

            <Separator />

            <ScrollArea className="flex-1 p-4">
                <div className="flex flex-col space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex ${
                                message.sender === 'user' ? 'justify-end' : 'justify-start'
                            }`}
                        >
                            <div
                                className={`flex max-w-[80%] items-start space-x-2 ${
                                    message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : 'flex-row'
                                }`}
                            >
                                <Avatar className="h-8 w-8">
                                    <AvatarFallback>
                                        {message.sender === 'user' ? 'U' : 'AI'}
                                    </AvatarFallback>
                                </Avatar>
                                <div
                                    className={`rounded-lg px-4 py-2 ${
                                        message.sender === 'user'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 text-gray-900'
                                    }`}
                                >
                                    <p>{message.content}</p>
                                    <span className="mt-1 text-xs opacity-70">
                    {new Intl.DateTimeFormat('en-US', {
                        hour: '2-digit',
                        minute: '2-digit',
                    }).format(message.timestamp)}
                  </span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </ScrollArea>

            <div className="p-4">
                <div className="flex space-x-2">
                    <Input
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1"
                        onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                                handleSendMessage();
                            }
                        }}
                    />
                    <Button onClick={handleSendMessage} size="icon">
                        <Send className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </Card>
    );
}