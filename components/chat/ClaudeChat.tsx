// components/chat/claude-chat.tsx
"use client";

import React, { CSSProperties, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import type { ComponentProps } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Copy,
  RotateCcw,
  ThumbsUp,
  ThumbsDown,
  Paperclip,
  ChevronDown,
  X,
  ArrowUp,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "../ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@radix-ui/react-tooltip";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {PrismLight, Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula, dark } from "react-syntax-highlighter/dist/esm/styles/prism";
interface Message {
  id: string;
  content: string;
  sender: "user" | "assistant";
  timestamp: Date;
}

export default function ClaudeChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [showTip, setShowTip] = useState(true);

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, newMessage]);
    setInputMessage("");

    // Simulate assistant response
    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: `
            ### Code Example:
            Here is a Python code block:
            
            \`\`\`python
            def greet(name):
                return f"Hello, {name}!"
                
            print(greet('Alice'))
            \`\`\`
                `,
        sender: "assistant",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    }, 1000);
  };

  const handleCopyMessage = (message: string) => {
    navigator.clipboard.writeText(message);
    console.log("Message copied to clipboard:", message);
  };

  return (
    <div className="relative flex h-screen flex-col">
      {/* Tip Alert */}
      {showTip && (
        <Alert className="mx-4 mt-4 bg-indigo-950 text-white">
          <AlertDescription className="flex items-center justify-between">
            <span>
              <span className="font-semibold">Tip:</span> Long chats cause you
              to reach your usage limits faster.
            </span>
            <div className="flex items-center gap-4">
              <Button variant="link" className="text-white hover:text-white/80">
                Start a new chat
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/10"
                onClick={() => setShowTip(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-8">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex items-start gap-4 ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {message.sender === "assistant" ? (
                <div className="h-6 w-6 rounded-full bg-primary" />
              ) : (
                <div className="h-6 w-6 rounded-full bg-gray-400" />
              )}
              <div
                className={`flex-1 ${message.sender === "user" ? "text-right" : ""}`}
              >
                <ReactMarkdown
                  components={{
                    code: ({ node, className, children, ...props }) => {
                      const match = /language-(\w+)/.exec(className || "");
                      return match ? (
                        <SyntaxHighlighter
                          children={String(children).replace(/\n$/, "")}
                          style={darcula}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        />
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      );
                    },
                  }}
                  remarkPlugins={[remarkGfm]}
                  className="whitespace-pre-wrap break-words"
                >
                  {message.content}
                </ReactMarkdown>
                {message.sender === "assistant" && (
                  <div className="mt-2 flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleCopyMessage(message.content)}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <ThumbsUp className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <ThumbsDown className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Input Area */}
      <div className="border-t p-4">
        <div className="relative rounded-lg border bg-background">
          <div className="flex items-center gap-2 border-b px-3 py-2">
            <Select defaultValue="claude-3">
              <SelectTrigger className="w-[200px] border-0">
                <SelectValue placeholder="Select Model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="claude-3">Adam</SelectItem>
                <SelectItem value="claude-2">Eve</SelectItem>
              </SelectContent>
            </Select>
            <Separator orientation="vertical" className="h-6" />
            <Select defaultValue="normal">
              <SelectTrigger className="w-[150px] border-0">
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground">Choose style</span>
                  <ChevronDown className="h-4 w-4" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="creative">Creative</SelectItem>
                <SelectItem value="precise">Precise</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Textarea
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="Message Claude..."
            className="min-h-[100px] border-0 focus-visible:ring-0"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSendMessage();
              }
            }}
          />

          <div className="flex items-center justify-between border-t p-2">
            <div>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Upload File</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <img
                        className="h-5 w-5"
                        src={"/assets/s3.png"}
                        alt={"s3"}
                        height={50}
                      />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>S3 Bucket</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>Use</span>
              <kbd className="rounded border px-2 py-0.5">shift + return</kbd>
              <span>for new line</span>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll to Top Button */}
      <Button
        variant="secondary"
        size="icon"
        className="absolute bottom-24 right-4 rounded-full"
      >
        <ArrowUp className="h-4 w-4" />
      </Button>
    </div>
  );
}
