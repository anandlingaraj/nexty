// app/chat/[id]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import ChatInterface from "@/components/chat/ChatInterface";
import { getSessionMessagesAction } from '../actions';
import { CustomSession } from '../page';


export default function ChatSessionPage() {
    const params = useParams();
    const { data: session, status } = useSession() as {
        data: CustomSession | null;
        status: "loading" | "authenticated" | "unauthenticated"
    };
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadInitialMessages = async () => {
            if (!session?.user?.id || !params.id) return;

            try {
                setLoading(true);
                setError(null);
                await getSessionMessagesAction(
                    session.user.id,
                    params.id as string,
                    'default'
                );
            } catch (error) {
                setError('Failed to load messages');
                console.error('Error loading messages:', error);
            } finally {
                setLoading(false);
            }
        };

        if (status !== 'loading') {
            loadInitialMessages();
        }
    }, [params.id, session?.user?.id, status]);

    if (status === 'loading' || loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 flex items-center justify-center text-red-500">
                {error}
            </div>
        );
    }

    if (!session) {
        return (
            <div className="flex-1 flex items-center justify-center">
                Please sign in to access chat
            </div>
        );
    }

    return (
        <div className="flex-1">
            <ChatInterface
                chatId={params.id as string}
                userId={session.user.id}
            />
        </div>
    );
}