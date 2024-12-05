// app/admin/analytics/page.tsx
'use client';

import { useState } from 'react';
import { AnalyticsDashboard } from '@/components/admin/analytics/AnalyticsPage';

interface Document {
    id: string;
    type: string;
    size: number;
    createdAt: Date;
}

interface LogEntry {
    id: string;
    level: 'info' | 'warning' | 'error';
    timestamp: Date;
}

export default function AnalyticsPage() {
    // Sample data - replace with real data fetching
    const [documents] = useState<Document[]>([
        {
            id: '1',
            type: 'pdf',
            size: 1024 * 1024,
            createdAt: new Date(),
        },
        // Add more sample documents
    ]);

    const [logs] = useState<LogEntry[]>([
        {
            id: '1',
            level: 'info',
            timestamp: new Date(),
        },
        // Add more sample logs
    ]);

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-3xl font-bold">Analytics</h1>
                <p className="text-muted-foreground">
                    System performance and usage metrics
                </p>
            </div>

            <AnalyticsDashboard
                logs={logs}
                documents={documents}
            />
        </div>
    );
}