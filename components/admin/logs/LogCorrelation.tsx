import { LogEntry } from "@/app/admin/logs/types";
import { Card } from "@/components/ui/card";
import { useMemo } from "react";
import { Timeline } from "./Timeline";



export function LogCorrelation({ logs }: { logs: LogEntry[] }) {
    const correlations = useMemo(() => {
        const groups = new Map<string, LogEntry[]>();

        logs.forEach(log => {
            if (log.correlationId) {
                const group = groups.get(log.correlationId) || [];
                group.push(log);
                groups.set(log.correlationId, group);
            }
        });

        return Array.from(groups.entries())
            .map(([id, groupLogs]) => ({
                id,
                logs: groupLogs,
                duration: Math.max(...groupLogs.map(l => l.timestamp.getTime())) -
                    Math.min(...groupLogs.map(l => l.timestamp.getTime())),
            }));
    }, [logs]);

    return (
        <div className="space-y-4">
            {correlations.map(correlation => (
                <Card key={correlation.id} className="p-4">
                    <div className="flex justify-between">
                        <div>
                            <h3 className="font-medium">Correlation ID: {correlation.id}</h3>
                            <p className="text-sm text-muted-foreground">
                                Duration: {correlation.duration}ms
                            </p>
                        </div>
                    </div>
                    <Timeline items={correlation.logs} />
                </Card>
            ))}
        </div>
    );
}
