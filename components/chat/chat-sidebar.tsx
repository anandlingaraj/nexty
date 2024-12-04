// components/chat/chat-sidebar.tsx
'use client';

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
    Plus,
    MessageSquare,
    Clock,
    Trash2,
    ChevronLeft,
    Menu
} from "lucide-react";
import { cn } from "@/lib/utils";
import UserMenu from "../popup-menu/user-menu";

interface ChatSession {
    id: string;
    title: string;
    lastMessage: string;
    timestamp: Date;
}

export default function ChatSidebar() {
    const router = useRouter();
    const params = useParams();
    const [isOpen, setIsOpen] = useState(true);
    const [sessions, setSessions] = useState<ChatSession[]>([
        {
            id: '1',
            title: 'Chat about React Performance',
            lastMessage: 'How can I optimize my React app?',
            timestamp: new Date(),
        },
        {
            id: '2',
            title: 'Next.js API Routes',
            lastMessage: 'Implementing API routes in Next.js',
            timestamp: new Date(),
        },
    ]);

    const createNewChat = () => {
        const newChatId = Date.now().toString();
        router.push(`/chat/${newChatId}`);
    };

    const deleteSession = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setSessions(sessions.filter(session => session.id !== id));
    };

    return (
        <>
            <Button
                variant="ghost"
                size="icon"
                className="absolute left-4 top-4 z-50 md:hidden"
                onClick={() => setIsOpen(!isOpen)}
            >
                <Menu className="h-4 w-4" />
            </Button>

            <div className={cn(
                "fixed left-0 top-0 z-40 flex h-full w-72 flex-col border-r bg-background transition-transform duration-300 ease-in-out md:translate-x-0",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="flex h-14 items-center justify-between border-b px-4">
                    <h2 className="text-lg font-semibold">Chat History</h2>
                    <Button
                        onClick={createNewChat}
                        variant="ghost"
                        size="icon"
                    >
                        <Plus className="h-4 w-4" />
                    </Button>
                </div>

                <ScrollArea className="flex-1 px-2">
                    <div className="space-y-2 p-2">
                        <div className="py-2">
                            <h3 className="mb-2 px-2 text-sm font-semibold">Recent</h3>
                            {sessions.map((session) => (
                                <Button
                                    key={session.id}
                                    variant="ghost"
                                    className={cn(
                                        "group relative w-full justify-start text-left",
                                        params?.id === session.id && "bg-accent"
                                    )}
                                    onClick={() => router.push(`/chat/${session.id}`)}
                                >
                                    <MessageSquare className="mr-2 h-4 w-4" />
                                    <div className="flex flex-1 flex-col overflow-hidden">
                                        <span className="truncate font-medium">{session.title}</span>
                                        <span className="truncate text-xs text-muted-foreground">
                      {session.lastMessage}
                    </span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="absolute right-2 hidden h-6 w-6 group-hover:flex"
                                        onClick={(e) => deleteSession(session.id, e)}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </Button>
                                </Button>
                            ))}
                        </div>

                        <Separator />

                        <div className="py-2">
                            <h3 className="mb-2 px-2 text-sm font-semibold">Previous 7 Days</h3>
                            {sessions.map((session) => (
                                <Button
                                    key={session.id}
                                    variant="ghost"
                                    className="w-full justify-start"
                                    onClick={() => router.push(`/chat/${session.id}`)}
                                >
                                    <Clock className="mr-2 h-4 w-4" />
                                    <div className="flex flex-1 flex-col overflow-hidden">
                                        <span className="truncate font-medium">{session.title}</span>
                                        <span className="truncate text-xs text-muted-foreground">
                      {new Intl.DateTimeFormat('en-US', {
                          month: 'short',
                          day: 'numeric'
                      }).format(session.timestamp)}
                    </span>
                                    </div>
                                </Button>
                            ))}
                        </div>
                    </div>
                </ScrollArea>
                <UserMenu />
            </div>
        </>
    );
}

