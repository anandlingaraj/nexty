import ChatSidebar from "@/components/chat/ChatSidebar";
import React from "react";

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-background">
      <ChatSidebar />
      <main className="flex flex-1 flex-col pl-72">{children}</main>
    </div>
  );
}
