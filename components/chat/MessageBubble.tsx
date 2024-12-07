import { MessageContent } from "./MessageContent";
import {Message} from '@/types/chat'
interface AvatarProps {
    sender: "user" | "assistant";
}
export const Avatar: React.FC<AvatarProps> = ({ sender }) => {
    return (
        <div className="flex-shrink-0">
            {sender === "assistant" ? (
                <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
                    C
                </div>
            ) : (
                <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
                    U
                </div>
            )}
        </div>
    );
};
export const MessageBubble = ({ message, onCopy }: { message: Message; onCopy: (content: string) => void }) => {
    return (
        <div className="flex items-start gap-4 mb-6">
            <div className={`flex w-full gap-3 ${message.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
                <Avatar sender={message.sender}/>
                <div className={`flex flex-col gap-2 w-full max-w-[80%]`}>
                    <div
                        className={`rounded-lg p-4 ${
                            message.sender === "user"
                                ? "bg-primary text-primary-foreground ml-auto"
                                : "bg-muted"
                        }`}
                    >
                        <MessageContent
                            content={message.content}
                            sender={message.sender}
                            onCopy={onCopy}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};