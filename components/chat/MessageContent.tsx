import React from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { darcula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Copy } from "lucide-react";
import type { Components } from "react-markdown";

interface MessageContentProps {
    content: string;
    sender: "user" | "assistant";
    onCopy?: (content: string) => void;
}

export const MessageContent: React.FC<MessageContentProps> = ({
                                                                  content,
                                                                  sender,
                                                                  onCopy
                                                              }) => {
    const handleCodeCopy = (code: string) => {
        if (onCopy) {
            onCopy(code);
        } else {
            navigator.clipboard.writeText(code);
        }
    };

    const components: Components = {
        code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : '';

            if (inline) {
                return (
                    <code className={className} {...props}>
                        {children}
                    </code>
                );
            }

            return (
                <div className="my-4 overflow-hidden rounded-md border bg-neutral-900">
                    <div className="flex items-center justify-between bg-neutral-800 px-4 py-2">
            <span className="text-sm text-neutral-400">
              {language}
            </span>
                        <button
                            onClick={() => handleCodeCopy(String(children))}
                            className="flex items-center gap-1.5 text-sm text-neutral-400 hover:text-neutral-200"
                        >
                            <Copy className="h-4 w-4"/>
                            Copy
                        </button>
                    </div>

                    <SyntaxHighlighter
                        language={language}
                        style={darcula}
                        customStyle={{
                            margin: 0,
                            padding: '1rem',
                            background: 'transparent',
                        }}
                        {...props}
                    >
                        {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                </div>
            );
        },
        h3({ children }) {
            return <h3 className="mb-4 text-xl font-semibold">{children}</h3>;
        },
        p({ children }) {
            return <p className="mb-4 last:mb-0">{children}</p>;
        },
    };

    return (
        <Markdown
            components={components}
            remarkPlugins={[remarkGfm]}
            className="prose dark:prose-invert max-w-none"
        >
            {content}
        </Markdown>
    );
};