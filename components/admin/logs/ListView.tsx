// components/admin/logs/LogListView.tsx
'use client';

import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import { ChevronRight } from "lucide-react";

interface LogEntry {
    id: string;
    timestamp: Date;
    level: 'info' | 'warning' | 'error';
    action: string;
    user: { email: string; name: string } | string;
    resource: string;
    details: string;
    metadata: Record<string, any>;
}

interface LogListViewProps {
    logs: LogEntry[];
}

export function LogListView({ logs }: LogListViewProps) {
    const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null);

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



    return (
        <>
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Timestamp</TableHead>
                                <TableHead>Level</TableHead>
                                <TableHead>Action</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead>Resource</TableHead>
                                <TableHead>Details</TableHead>
                                <TableHead></TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {logs.map((log) => (
                                <TableRow
                                    key={log.id}
                                    className="cursor-pointer hover:bg-muted/50"
                                    onClick={() => setSelectedLog(log)}
                                >
                                    <TableCell>{format(log.timestamp, 'PPpp')}</TableCell>
                                    <TableCell>{getLevelBadge(log.level)}</TableCell>
                                    <TableCell>{log.action}</TableCell>
                                    <TableCell>
                                        {typeof log.user === 'string' ? log.user : log.user.email}
                                    </TableCell>
                                    <TableCell>{log.resource}</TableCell>
                                    <TableCell className="max-w-[300px] truncate">{log.details}</TableCell>
                                    <TableCell>
                                        <ChevronRight className="h-4 w-4" />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Log Detail Drawer */}
            <Drawer open={!!selectedLog} onOpenChange={() => setSelectedLog(null)}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>Log Details</DrawerTitle>
                        <DrawerDescription>
                            {selectedLog?.timestamp.toLocaleString()}
                        </DrawerDescription>
                    </DrawerHeader>
                    <ScrollArea className="h-[60vh] p-6">
                        {selectedLog && (
                            <div className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <h4 className="mb-2 text-sm font-medium">Basic Information</h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Level:</span>
                                                <span>{getLevelBadge(selectedLog.level)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Action:</span>
                                                <span>{selectedLog.action}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Resource:</span>
                                                <span>{selectedLog.resource}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="mb-2 text-sm font-medium">User Details</h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">User:</span>
                                                <span>{typeof selectedLog.user === 'string' ? selectedLog.user : selectedLog.user.email}</span>
                                            </div>
                                            <div className="flex justify-between">
                                            <span className="text-muted-foreground">IP:</span>
                                                <span>{selectedLog.metadata.ip}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Location:</span>
                                                <span>{selectedLog.metadata.location}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="mb-2 text-sm font-medium">Event Details</h4>
                                    <Card>
                                        <CardContent className="p-4">
                                            <pre className="whitespace-pre-wrap text-sm">
                                                {JSON.stringify(selectedLog.metadata, null, 2)}
                                            </pre>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        )}
                    </ScrollArea>
                    <DrawerFooter>
                        <DrawerClose asChild>
                            <Button variant="outline">Close</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </>
    );
}