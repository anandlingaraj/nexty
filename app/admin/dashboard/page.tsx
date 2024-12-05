// app/admin/dashboard/page.tsx
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import {
    Users,
    Database,
    MessageSquare,
    Activity,
    HardDrive,
    Clock,
    AlertCircle
} from "lucide-react";

// Sample data - replace with real data from your API
const usageData = {
    weekly: [
        { name: 'Mon', sessions: 120, messages: 450 },
        { name: 'Tue', sessions: 140, messages: 520 },
        { name: 'Wed', sessions: 180, messages: 600 },
        { name: 'Thu', sessions: 190, messages: 650 },
        { name: 'Fri', sessions: 160, messages: 550 },
        { name: 'Sat', sessions: 90, messages: 300 },
        { name: 'Sun', sessions: 85, messages: 280 }
    ],
    monthly: [
        // Similar structure for monthly data
        { name: 'Week 1', sessions: 800, messages: 2800 },
        { name: 'Week 2', sessions: 950, messages: 3200 },
        { name: 'Week 3', sessions: 890, messages: 3100 },
        { name: 'Week 4', sessions: 920, messages: 3300 }
    ]
};

export default function DashboardPage() {
    const [timeRange, setTimeRange] = useState('weekly');

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <Button variant="outline" size="sm">
                    <Clock className="mr-2 h-4 w-4" />
                    Last updated: {new Date().toLocaleTimeString()}
                </Button>
            </div>

            {/* Key Metrics */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="rounded-full bg-blue-100 p-3">
                                <Users className="h-6 w-6 text-blue-500" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Total Users</p>
                                <h3 className="text-2xl font-bold">2,543</h3>
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-green-600">
                            ↑ 12% from last month
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="rounded-full bg-purple-100 p-3">
                                <MessageSquare className="h-6 w-6 text-purple-500" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Active Sessions</p>
                                <h3 className="text-2xl font-bold">187</h3>
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-muted-foreground">
                            Currently active
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="rounded-full bg-orange-100 p-3">
                                <Database className="h-6 w-6 text-orange-500" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Storage Sources</p>
                                <h3 className="text-2xl font-bold">5</h3>
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-muted-foreground">
                            3 S3, 1 Azure, 1 GCP
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                            <div className="rounded-full bg-green-100 p-3">
                                <Activity className="h-6 w-6 text-green-500" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">System Health</p>
                                <h3 className="text-2xl font-bold">98.2%</h3>
                            </div>
                        </div>
                        <div className="mt-4 text-sm text-green-600">
                            All systems operational
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Usage Charts */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Usage Analytics</CardTitle>
                            <CardDescription>Session and message activity over time</CardDescription>
                        </div>
                        <Tabs value={timeRange} onValueChange={setTimeRange}>
                            <TabsList>
                                <TabsTrigger value="weekly">Weekly</TabsTrigger>
                                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="h-[400px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={usageData[timeRange as keyof typeof usageData]}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Line
                                    type="monotone"
                                    dataKey="sessions"
                                    stroke="#8884d8"
                                    name="Sessions"
                                />
                                <Line
                                    type="monotone"
                                    dataKey="messages"
                                    stroke="#82ca9d"
                                    name="Messages"
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </CardContent>
            </Card>

            {/* Storage & System Status */}
            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Storage Status</CardTitle>
                        <CardDescription>Connected storage sources and their status</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <HardDrive className="h-4 w-4 text-muted-foreground" />
                                    <span>Production S3</span>
                                </div>
                                <Badge variant="outline" className="bg-green-100 text-green-800">
                                    Connected
                                </Badge>
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <HardDrive className="h-4 w-4 text-muted-foreground" />
                                    <span>Azure Backup</span>
                                </div>
                                <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                                    Syncing
                                </Badge>
                            </div>
                            {/* Add more storage sources */}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Alerts</CardTitle>
                        <CardDescription>System notifications and warnings</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 rounded-lg bg-yellow-50 p-3 text-sm">
                                <AlertCircle className="h-4 w-4 text-yellow-600" />
                                <span>High CPU usage detected (85%)</span>
                                <span className="ml-auto text-xs text-muted-foreground">2h ago</span>
                            </div>
                            <div className="flex items-center gap-2 rounded-lg bg-red-50 p-3 text-sm">
                                <AlertCircle className="h-4 w-4 text-red-600" />
                                <span>Failed login attempts from IP 192.168.1.1</span>
                                <span className="ml-auto text-xs text-muted-foreground">5h ago</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}