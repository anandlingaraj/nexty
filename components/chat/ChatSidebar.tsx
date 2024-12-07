// components/chat/chat-sidebar.tsx
"use client";

import {useEffect, useState } from "react";
import { useRouter, useParams, usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Plus,
  MessageSquare,
  Clock,
  Menu,
} from "lucide-react";
import { cn } from "@/lib/utils";
import UserMenu from "../popup-menu/user-menu";
import { Chat, Conversation } from "@/types/chat";
import { fetchConversationsAction } from "@/app/chat/actions";
import { format } from "date-fns";

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
  const pathname = usePathname();
  const [sessions, setSessions] = useState<ChatSession[]>([
  ]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadConversations = async () => {
      try {
        const data = await fetchConversationsAction();
        setConversations(data);
      } catch (error) {
        console.error('Error loading conversations:', error);
      } finally {
        setLoading(false);
      }
    };

    loadConversations();
  }, []);

  const createNewChat = () => {
    const newChatId = Date.now().toString();
    router.push(`/chat/${newChatId}`);
  };

  const deleteSession = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSessions(sessions.filter((session) => session.id !== id));
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

      <div
        className={cn(
          "fixed left-0 top-0 z-40 flex h-full w-72 flex-col border-r bg-background transition-transform duration-300 ease-in-out md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-14 items-center justify-between border-b px-4">
          <h2 className="text-lg font-semibold">Chat History</h2>
          <Button onClick={createNewChat} variant="ghost" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        <ScrollArea className="flex-1 px-2">
          <div className="space-y-2 p-2">
            <div className="py-2">
              <h3 className="mb-2 px-2 text-sm font-semibold">Recent</h3>
              {loading ? (
                  <div className="flex items-center justify-center p-4">
                    <span className="text-sm text-muted-foreground">Loading conversations...</span>
                  </div>
              ) : (
                  <div className="space-y-2">
              {conversations.map((conversation) => (
                  <Button
                      key={conversation.id}
                      variant="ghost"
                      className={cn(
                          "w-full justify-start gap-2 rounded-lg p-3",
                          pathname === `/chat/${conversation.session_id}` && "bg-muted"
                      )}
                      onClick={() => router.push(`/chat/${conversation.session_id}`)}
                  >
                    <MessageSquare className="h-4 w-4" />
                    <div className="flex flex-col items-start overflow-hidden">
                  <span className="text-sm font-medium">
                    {conversation.name || 'New Chat'}
                  </span>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <span className="line-clamp-1">
                      {conversation.user_input || 'No messages yet'}
                    </span>
                        <span className="shrink-0">
                      {format(new Date(conversation.timestamp), 'MMM d')}
                    </span>
                      </div>
                    </div>
                  </Button>
              ))}
                  </div>
              )}

            </div>

            <Separator />

            <div className="py-2">
              <h3 className="mb-2 px-2 text-sm font-semibold">
                Previous 7 Days
              </h3>
              {sessions.map((session) => (
                <Button
                  key={session.id}
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={() => router.push(`/chat/${session.id}`)}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  <div className="flex flex-1 flex-col overflow-hidden">
                    <span className="truncate font-medium">
                      {session.title}
                    </span>
                    <span className="truncate text-xs text-muted-foreground">
                      {new Intl.DateTimeFormat("en-US", {
                        month: "short",
                        day: "numeric",
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
