import { MessageContent } from "./MessageContent";
import { Message } from '@/types/chat'
interface AvatarProps {
    sender: "user" | "assistant" | "bot";
    className?: string;
}

interface MessageBubbleProps {
    message: Message;
    onCopy: (content: string) => void;
}
export const Avatar: React.FC<AvatarProps> = ({ sender, className = '' }) => {
    if (sender === 'assistant' || sender === 'bot') {
        return (
            <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-purple-600 text-sm font-medium text-white ${className}`}>
                A
            </div>
        );
    }

    return (
        <div className={`flex h-8 w-8 items-center justify-center rounded-full bg-neutral-200 dark:bg-neutral-800 text-sm font-medium text-neutral-900 dark:text-white ${className}`}>
            U
        </div>
    );
};
export const MessageBubble: React.FC<MessageBubbleProps> = ({ message, onCopy }) => {    const content = message.content || message.text
    return (
        <div className="flex items-start gap-4 mb-6 px-6 py-2">
            <div className={`flex w-full gap-3 ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <Avatar sender={message.sender}/>
                <div className={`flex flex-col gap-2 w-full max-w-[70%]`}>
                    <div
                        className={`rounded-lg p-4 ${
                            message.sender === "user"
                                ? "bg-secondary text-primary-foreground ml-auto"
                                : "bg-muted"
                        }`}
                    >
                        <MessageContent
                            content={ content}
                            sender={message.sender}
                            onCopy={onCopy}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};