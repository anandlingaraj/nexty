'use client';
import { usePathname, useSearchParams } from 'next/navigation';
import ChatInterface from "@/components/chat/ChatInterface";

export default function ChatSessionPage() {
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const parts = pathname.split('/');
    const id = parts[parts.length - 1];
    const userId = '23fe3caa-da26-4dcc-9c6b-6d5fb631a725';
    console.log("ID", id, " ", pathname);
    return (
        <div className="flex h-screen max-h-screen flex-col p-4">
            {id && <ChatInterface chatId={id} userId={userId} />}
        </div>
    );
}