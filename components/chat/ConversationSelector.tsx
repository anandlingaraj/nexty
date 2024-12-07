import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';

interface Conversation {
    session_id: string;
    timestamp: string | Date;
}

interface ConversationSelectorProps {
    conversations: Conversation[];
    defaultValue?: string;
    onSelect: (sessionId: string) => void;
}
export const ConversationSelector: React.FC<ConversationSelectorProps> = ({conversations,
                                                                              defaultValue,
                                                                              onSelect
                                                                          }) => (
    <div className="border-b p-2">
        <Select
            defaultValue={defaultValue}
            onValueChange={onSelect}
        >
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Conversation" />
            </SelectTrigger>
            <SelectContent>
                {conversations.map((conv: any, index: number) => (
                    <SelectItem key={index} value={conv.session_id}>
                        Conversation {new Date(conv.timestamp).toLocaleDateString()}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    </div>
);
