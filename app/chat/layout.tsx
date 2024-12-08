import ChatSidebar from "@/components/chat/ChatSidebar";
import React from "react";
import { SessionProvider } from "@/components/providers/SessionProvider";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
        <SessionProvider>
            <div className="flex min-h-screen bg-background">
              <ChatSidebar />
              <main className="flex flex-1 flex-col pl-72">{children}</main>
            </div>
        </SessionProvider>
  );
}
