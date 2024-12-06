import { notFound } from "next/navigation";
import ChatInterface from "@/components/chat/chat-interface";
import ClaudeChat from "@/components/chat/ClaudeChat";

interface ChatPageProps {
    params: {
        id: string;
    };
}

export default function ChatSessionPage({ params }: ChatPageProps) {
    if (!params.id) {
        notFound();
    }

    return (
        <div className="flex h-screen max-h-screen flex-col p-4">
            {/*<ChatInterface chatId={params.id} />*/}
            <ClaudeChat chatId={params.id}/>
        </div>
    );
}