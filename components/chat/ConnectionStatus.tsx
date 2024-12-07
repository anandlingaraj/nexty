// components/chat/StatusIndicators.tsx

import { ReadyState } from 'react-use-websocket';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { Wifi, WifiOff, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import React from "react";

interface ConnectionStatusProps {
    readyState: ReadyState;
}

export const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ readyState }) => {
    const statusConfig = {
        [ReadyState.CONNECTING]: {
            title: "Connecting",
            description: "Establishing connection...",
            icon: Wifi,
            variant: "default" as const
        },
        [ReadyState.OPEN]: {
            title: "Connected",
            description: "Connection established",
            icon: Wifi,
            variant: "default" as const
        },
        [ReadyState.CLOSING]: {
            title: "Disconnecting",
            description: "Connection closing...",
            icon: WifiOff,
            variant: "default" as const
        },
        [ReadyState.CLOSED]: {
            title: "Disconnected",
            description: "Connection lost. Attempting to reconnect...",
            icon: AlertCircle,
            variant: "destructive" as const
        },
        [ReadyState.UNINSTANTIATED]: {
            title: "Not Connected",
            description: "Initializing connection...",
            icon: WifiOff,
            variant: "default" as const
        },
    };

    const status = statusConfig[readyState];
    const Icon = status.icon;

    if (readyState === ReadyState.OPEN) return null;

    return (
        <Alert
            variant={status.variant}
            className={cn(
                "mx-4 mt-4 transition-all duration-300",
                readyState === ReadyState.CLOSED && "animate-pulse"
            )}
        >
            <Icon className="h-4 w-4" />
            <AlertTitle>{status.title}</AlertTitle>
            <AlertDescription>{status.description}</AlertDescription>
        </Alert>
    );
};