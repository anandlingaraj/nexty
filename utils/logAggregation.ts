// app/admin/logs/types.ts
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

// utils/logAggregation.ts
import { format, startOfHour } from 'date-fns';

export function groupBy<T>(items: T[], key: keyof T): Record<string, T[]> {
    return items.reduce((result, item) => {
        const groupKey = String(item[key]);
        if (!result[groupKey]) {
            result[groupKey] = [];
        }
        result[groupKey].push(item);
        return result;
    }, {} as Record<string, T[]>);
}

export function groupByHour(logs: LogEntry[]) {
    const hourGroups = groupBy(logs, 'timestamp');
    const hours = Object.keys(hourGroups).map(timestamp => startOfHour(new Date(timestamp)));
    const uniqueHours = Array.from(new Set(hours));

    return uniqueHours
        .sort((a, b) => a.getTime() - b.getTime())
        .map(hour => ({
            hour: format(hour, 'HH:mm'),
            count: logs.filter(log =>
                startOfHour(new Date(log.timestamp)).getTime() === hour.getTime()
            ).length
        }));
}