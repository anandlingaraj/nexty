import ChatInterface from "@/components/chat/chat-interface";
import ClaudeChat from "@/components/chat/ClaudeChat";

export default function ChatPage() {
    return (
        <div className="flex h-screen max-h-screen flex-col p-4">
            {/*<ChatInterface />*/}
            <ClaudeChat/>
        </div>
    );
}