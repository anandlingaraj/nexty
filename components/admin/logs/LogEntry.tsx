// components/logs/LogEntry.tsx
import { useState } from 'react';
import { format } from 'date-fns';
import {
    ChevronRight,
    ChevronDown,
    AlertCircle,
    Info,
    AlertTriangle,
    Copy,
    ExternalLink
} from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

interface LogEntry {
    id: string;
    timestamp: Date;
    level: 'info' | 'warning' | 'error';
    action: string;
    user: string;
    resource: string;
    details: string;
    correlationId?: string;
    metadata: Record<string, any>;
}

interface LogEntryProps {
    log: LogEntry;
}

export function LogEntry({ log }: LogEntryProps) {
    const [isExpanded, setIsExpanded] = useState(false);

    const getLevelIcon = (level: string) => {
        switch (level) {
            case 'error':
                return <AlertCircle className="h-4 w-4 text-red-500" />;
            case 'warning':
                return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
            default:
                return <Info className="h-4 w-4 text-blue-500" />;
        }
    };

    const getLevelBadge = (level: 'info' | 'warning' | 'error') => {
        const variantMap: Record<'info' | 'warning' | 'error', "default" | "secondary" | "destructive" | "outline"> = {
            info: "default",
            warning: "secondary",
            error: "destructive"
        };

        return (
            <Badge variant={variantMap[level]}>
                {level}
            </Badge>
        );
    };


    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        // You might want to show a toast notification here
    };

    return (
        <Collapsible
            open={isExpanded}
            onOpenChange={setIsExpanded}
            className="rounded-lg border bg-card text-card-foreground"
        >
            <div className="flex items-center gap-2 p-4">
                <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="sm">
                        {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                        ) : (
                            <ChevronRight className="h-4 w-4" />
                        )}
                    </Button>
                </CollapsibleTrigger>

                {/* Basic Log Info */}
                <div className="flex flex-1 items-center gap-4">
                    <div className="flex items-center gap-2">
                        {getLevelIcon(log.level)}
                        {getLevelBadge(log.level)}
                    </div>

                    <div className="flex-1">
                        <div className="font-medium">{log.action}</div>
                        <div className="text-sm text-muted-foreground">
                            {log.details}
                        </div>
                    </div>

                    <div className="text-sm text-muted-foreground">
                        {format(new Date(log.timestamp), 'PPpp')}
                    </div>
                </div>
            </div>

            {/* Expanded Details */}
            <CollapsibleContent>
                <div className="border-t px-4 py-3">
                    <div className="grid gap-4 md:grid-cols-2">
                        {/* Main Information */}
                        <div className="space-y-3">
                            <div>
                                <h4 className="mb-2 text-sm font-medium">Event Details</h4>
                                <div className="space-y-2 rounded-lg bg-muted p-3">
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">User</span>
                                        <span className="text-sm">{log.user}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-sm text-muted-foreground">Resource</span>
                                        <span className="text-sm">{log.resource}</span>
                                    </div>
                                    {log.correlationId && (
                                        <div className="flex justify-between">
                                            <span className="text-sm text-muted-foreground">Correlation ID</span>
                                            <span className="text-sm">{log.correlationId}</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Metadata */}
                        <div>
                            <div className="flex items-center justify-between">
                                <h4 className="text-sm font-medium">Metadata</h4>
                                <TooltipProvider>
                                    <Tooltip>
                                        <TooltipTrigger asChild>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => copyToClipboard(JSON.stringify(log.metadata, null, 2))}
                                            >
                                                <Copy className="h-4 w-4" />
                                            </Button>
                                        </TooltipTrigger>
                                        <TooltipContent>Copy metadata</TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            </div>
                            <ScrollArea className="h-[200px] rounded-lg bg-muted p-3">
                <pre className="text-xs">
                  {JSON.stringify(log.metadata, null, 2)}
                </pre>
                            </ScrollArea>
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-4 flex gap-2">
                        <Button variant="outline" size="sm">
                            <ExternalLink className="mr-2 h-4 w-4" />
                            View Related Logs
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => copyToClipboard(JSON.stringify(log))}>
                            <Copy className="mr-2 h-4 w-4" />
                            Copy Log
                        </Button>
                    </div>
                </div>
            </CollapsibleContent>
        </Collapsible>
    );
}