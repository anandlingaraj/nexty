// components/logs/LogViewer.tsx
import { ReactNode } from 'react';

interface LogViewerProps {
    children: ReactNode;
}

export function LogViewer({ children }: LogViewerProps) {
    return (
        <div className="space-y-4">
            {/* Any log viewer specific UI elements */}
            <div className="rounded-lg border bg-card">
                {children}
            </div>
        </div>
    );
}
