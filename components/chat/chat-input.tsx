'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FileUpload } from './file-upload';

export function ChatInput() {
    const [message, setMessage] = useState('');
    const { data: session } = useSession();

    const sendMessage = async () => {
        if (!message.trim()) return;

        try {
            await fetch('/api/chat/messages', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${session?.accessToken}`
                },
                body: JSON.stringify({ content: message })
            });
            setMessage('');
        } catch (error) {
            console.error('Failed to send message:', error);
        }
    };

    return (
        <div className="flex flex-col gap-2 p-4 border-t">
            <FileUpload onUpload={() => {}} />
            <div className="flex gap-2">
                <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message..."
                    className="flex-1"
                />
                <Button onClick={sendMessage}>Send</Button>
            </div>
        </div>
    );
}