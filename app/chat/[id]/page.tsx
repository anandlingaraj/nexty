'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import ChatInterface from "@/components/chat/ChatInterface";
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { getSessionMessagesAction } from '../actions';

export default function ChatSessionPage() {
    const pathname = usePathname();
    const params = useParams();
    const { data: session } = useSession();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // const searchParams = useSearchParams();
    const parts = pathname.split('/');
    const id = parts[parts.length - 1];

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

        loadInitialMessages();
    }, [params.id, session?.user?.id]);

    if (loading) {
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
    return (
        <div className="flex-1">
            <ChatInterface
                chatId={params.id as string}
                userId={session?.user?.id || ''}
            />
        </div>
    );

    // return (
    //     <div className="flex h-screen max-h-screen flex-col p-4">
    //         {id && <ChatInterface chatId={id} userId={userId} />}
    //     </div>
    // );
}