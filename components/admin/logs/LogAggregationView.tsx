import { LogEntry } from "@/app/admin/logs/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { groupBy, groupByHour } from "@/utils/logAggregation";
import { useMemo } from "react";
import {Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export function LogAggregationView({ logs }: { logs: LogEntry[] }) {
    const aggregations = useMemo(() => {
        return {
            byLevel: groupBy(logs, 'level'),
            byAction: groupBy(logs, 'action'),
            byUser: groupBy(logs, 'user'),
            byHour: groupByHour(logs),
        };
    }, [logs]);

    return (
        <div className="grid grid-cols-2 gap-4">
            <Card>
                <CardHeader>
                    <CardTitle>Logs by Level</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                        <PieChart>
                            <Pie
                                data={Object.entries(aggregations.byLevel).map(([key, value]) => ({
                                    name: key,
                                    value: value!.length,
                                }))}
                                dataKey="value"
                                nameKey="name"
                            />
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Activity Over Time</CardTitle>
                </CardHeader>
                <CardContent>
                    <ResponsiveContainer width="100%" height={200}>
                        <LineChart data={aggregations.byHour}>
                            <XAxis dataKey="hour" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="count" />
                        </LineChart>
                    </ResponsiveContainer>
                </CardContent>
            </Card>
        </div>
    );
}


