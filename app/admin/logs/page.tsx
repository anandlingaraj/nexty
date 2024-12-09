// app/admin/logs/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { useWebSocket } from '@/hooks/useWebSocket';
import { FilterPresets } from '@/components/admin/logs/FilterPresets';
import { LogEntry } from '@/components/admin/logs/LogEntry';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LogListView } from '@/components/admin/logs/ListView';
import {Timeline} from '@/components/admin/logs/Timeline';
import { format } from 'date-fns';
import { LogAggregationView } from '@/components/admin/logs/LogAggregationView';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectItem, SelectContent, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from 'lucide-react';
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

interface FilterPreset {
    id: string;
    name: string;
    description?: string;
    filters: Record<string, any>;
    isDefault?: boolean;
}

const sampleLogs: LogEntry[] = [
    {
        id: '1',
        timestamp: new Date(),
        level: 'info',
        action: 'USER_LOGIN',
        user: 'john.doe@example.com',
        resource: 'auth',
        details: 'Successful login attempt',
        metadata: {
            ip: '192.168.1.1',
            userAgent: 'Mozilla/5.0...',
            location: 'New York, US',
        },
    },
];

export default function LogsPage() {
    const [logs, setLogs] = useState<LogEntry[]>(sampleLogs);
    const [activePresetId, setActivePresetId] = useState<string | null>(null);
    const [filters, setFilters] = useState<Record<string, any>>({});
    const [viewMode, setViewMode] = useState<'list' | 'correlation' | 'analytics'>('list');
    const [isRealtime, setIsRealtime] = useState(false);
    const [dateRange, setDateRange] = useState<{ from: Date; to: Date } | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    //WebSocket connection for real-time logs
    const socket = useWebSocket('wss://localhost:3000', {
        onOpen: () => console.log('Connected to log stream'),
        reconnectAttempts: 3,
    });

    const fetchLogs = async () => {
        try {
            setIsLoading(true);
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '50',
                ...(filters.level && { level: filters.level }),
                ...(filters.action && { action: filters.action }),
                ...(dateRange && {
                    timeRange: JSON.stringify({
                        from: dateRange.from,
                        to: dateRange.to
                    })
                })
            });

            const response = await fetch(`/api/logs?${params}`);
            const data = await response.json();

            setLogs(data.logs);
            setTotalPages(data.pages);
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!isRealtime) {
            fetchLogs();
        }
    }, [page, filters, dateRange, isRealtime]);

    useEffect(() => {
        if (isRealtime) {
            const unsubscribe = socket.subscribe('log', (newLog: LogEntry) => {
                setLogs(prev => [newLog, ...prev]);
            });
            return () => unsubscribe();
        }
    }, [isRealtime, socket]);
    const handlePresetSelect = (preset: FilterPreset) => {
        setActivePresetId(preset.id);
        setFilters(preset.filters);
    };

    const getCurrentFilters = () => filters;

    if (isLoading) {
        return <div className="flex justify-center p-4">Loading...</div>;
    }

    // Group logs by correlation ID
    const correlatedLogs = logs.reduce((acc, log) => {
        if (log.correlationId) {
            if (!acc[log.correlationId]) {
                acc[log.correlationId] = [];
            }
            acc[log.correlationId].push(log);
        }
        return acc;
    }, {} as Record<string, LogEntry[]>);

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">System Logs</h1>
                    <p className="text-muted-foreground">
                        Monitor and analyze system activities
                    </p>
                </div>
            </div>

            {/* Filters Section */}
            <Card className="p-4">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-2 mb-2">
                    <div className="flex gap-2">
                        <Input
                            placeholder="Search logs..."
                            className="flex-1"
                            onChange={(e) => {/* implement search */
                            }}
                        />
                    </div>

                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="w-full justify-start text-left font-normal">
                                <CalendarIcon className="mr-2 h-4 w-4"/>
                                {dateRange?.from ? (
                                    dateRange.to ? (
                                        <>
                                            {format(dateRange.from, "LLL dd, y")} -{" "}
                                            {format(dateRange.to, "LLL dd, y")}
                                        </>
                                    ) : (
                                        format(dateRange.from, "LLL dd, y")
                                    )
                                ) : (
                                    <span>Pick a date range</span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                                initialFocus
                                mode="range"
                                selected={{from: dateRange?.from, to: dateRange?.to}}
                                onSelect={(range: any) => setDateRange(range)}
                                numberOfMonths={2}
                            />
                        </PopoverContent>
                    </Popover>

                    <Select onValueChange={(value) => setFilters({...filters, level: value})}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select level"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="info">Info</SelectItem>
                            <SelectItem value="warning">Warning</SelectItem>
                            <SelectItem value="error">Error</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select onValueChange={(value) => setFilters({...filters, action: value})}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select action"/>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="USER_LOGIN">User Login</SelectItem>
                            <SelectItem value="USER_LOGOUT">User Logout</SelectItem>
                            <SelectItem value="DATA_MODIFY">Data Modified</SelectItem>
                            <SelectItem value="SETTINGS_CHANGE">Settings Changed</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
                <FilterPresets
                    onSelect={handlePresetSelect}
                    selected={activePresetId}
                    onSaveCurrentFilter={getCurrentFilters}
                />
            </Card>

            {/* Main Content */}
            <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as 'list' | 'correlation' | 'analytics')}>
                <div className="flex items-center justify-between">
                    <TabsList>
                        <TabsTrigger value="list">List View</TabsTrigger>
                        <TabsTrigger value="correlation">Correlation View</TabsTrigger>
                        <TabsTrigger value="analytics">Analytics</TabsTrigger>
                    </TabsList>

                    <div className="flex items-center gap-2">
                        <Switch
                            checked={isRealtime}
                            onCheckedChange={setIsRealtime}
                        />
                        <span className="text-sm">Real-time Updates</span>
                    </div>
                </div>

                <TabsContent value="list" className="mt-4">
                    {/*<LogViewer>*/}
                    {/*    <div className="space-y-2">*/}
                    {/*        {logs.map((log) => (*/}
                    {/*            <LogEntry key={log.id} log={log}/>*/}
                    {/*        ))}*/}
                    {/*    </div>*/}
                    {/*</LogViewer>*/}
                    <LogListView
                        logs={logs}
                    />
                </TabsContent>

                <TabsContent value="correlation" className="mt-4">
                    <div className="space-y-4">
                        {Object.entries(correlatedLogs).map(([correlationId, items]) => (
                            <Card key={correlationId} className="p-4">
                                <div className="flex justify-between">
                                    <div>
                                        <h3 className="font-medium">Correlation ID: {correlationId}</h3>
                                        <p className="text-sm text-muted-foreground">
                                            Duration: {
                                            Math.max(...items.map(l => l.timestamp.getTime())) -
                                            Math.min(...items.map(l => l.timestamp.getTime()))
                                        }ms
                                        </p>
                                    </div>
                                </div>
                                <Timeline items={items}/>
                            </Card>
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="analytics" className="mt-4">
                    {/* Statistics Section */}
                    <div className="grid gap-4 md:grid-cols-4 mb-4">
                        <Card>
                            <CardHeader>
                                <CardTitle>Total Logs</CardTitle>
                                <CardDescription>{logs.length} entries</CardDescription>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Error Rate</CardTitle>
                                <CardDescription>
                                    {((logs.filter(l => l.level === 'error').length / logs.length) * 100).toFixed(2)}%
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Active Users</CardTitle>
                                <CardDescription>
                                    {new Set(logs.map(l => l.user)).size} users
                                </CardDescription>
                            </CardHeader>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Time Range</CardTitle>
                                <CardDescription>
                                    {logs.length > 0 ? format(
                                        new Date(Math.min(...logs.map(l =>
                                            new Date(l.timestamp).getTime()
                                        ))),
                                        'Pp'
                                    ) : 'No logs'}
                                </CardDescription>
                                {/*<CardDescription>*/}
                                {/*    {logs.length > 0 ? format(*/}
                                {/*        new Date(Math.min(...logs.map(l => l.timestamp.getTime()))),*/}
                                {/*        'Pp'*/}
                                {/*    ) : 'No logs'}*/}
                                {/*</CardDescription>*/}
                            </CardHeader>
                        </Card>
                    </div>
                    <LogAggregationView logs={logs} />
                </TabsContent>
            </Tabs>


        </div>
    );
}
