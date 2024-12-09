'use client';

import { useSession } from 'next-auth/react';
import ChatInterface from "@/components/chat/ChatInterface";
import { useEffect } from 'react';
import { Session } from 'next-auth';

export interface CustomSession {
    user: {
        id: string;
        name?: string;
        email?: string;
        roles: string[];
    };
    expires: string;
    accessToken: string;
    idToken: string;
}
export default function ChatPage() {
    const { data: session, status } = useSession() as {
        data: CustomSession | null;
        status: "loading" | "authenticated" | "unauthenticated"
    };
    console.log('Session:', session);
    console.log('Session User:', session?.user);


    if (status === 'loading') {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900" />
            </div>
        );
    }


    if (!session || !session.user) {
        return (
            <div className="flex-1 flex items-center justify-center">
                Please sign in to access chat
            </div>
        );
    }

    return (
        <div className="flex-1">
            <ChatInterface
                userId={session.user.id}
            />
        </div>
    );
}