// types/logs.ts
export interface LogEntry {
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

export interface LogFilter {
    search?: string;
    level?: string[];
    action?: string[];
    timeRange?: { from: Date; to: Date };
    user?: string[];
    resource?: string[];
    correlationId?: string;
}

export interface LogAggregation {
    type: 'level' | 'action' | 'user' | 'resource';
    count: number;
    data: { label: string; value: number }[];
}