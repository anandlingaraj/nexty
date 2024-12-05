import { useMemo } from 'react';
import { format } from 'date-fns';
import { AlertCircle, AlertTriangle, Info } from 'lucide-react';
import { cn } from "@/lib/utils";

interface TimelineItem {
    id: string;
    timestamp: Date;
    level: 'info' | 'warning' | 'error';
    action: string;
    details: string;
}

interface TimelineProps {
    items: TimelineItem[];
}

export function Timeline({ items }: TimelineProps) {
    const sortedItems = useMemo(() =>
            [...items].sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()),
        [items]
    );

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

    const getLevelStyles = (level: string) => {
        switch (level) {
            case 'error':
                return 'border-red-200 bg-red-50';
            case 'warning':
                return 'border-yellow-200 bg-yellow-50';
            default:
                return 'border-blue-200 bg-blue-50';
        }
    };

    return (
        <div className="mt-4 space-y-0">
            {sortedItems.map((item, index) => (
                <div key={item.id} className="relative pl-8">
                    {/* Connector Line */}
                    {index !== sortedItems.length - 1 && (
                        <div
                            className="absolute left-4 top-4 h-full w-px -translate-x-1/2 border-l-2 border-dashed border-gray-200"
                            aria-hidden="true"
                        />
                    )}

                    {/* Timeline Item */}
                    <div className="relative pb-4">
                        {/* Dot */}
                        <div className="absolute left-0 top-2 -translate-x-1/2 transform">
                            <div className={cn(
                                "flex h-6 w-6 items-center justify-center rounded-full border-2",
                                getLevelStyles(item.level)
                            )}>
                                {getLevelIcon(item.level)}
                            </div>
                        </div>

                        {/* Content */}
                        <div className="rounded-lg border bg-card p-4 shadow-sm">
                            <div className="flex items-center justify-between">
                                <h4 className="font-medium">{item.action}</h4>
                                <time className="text-sm text-muted-foreground">
                                    {format(item.timestamp, 'HH:mm:ss')}
                                </time>
                            </div>
                            <p className="mt-1 text-sm text-muted-foreground">
                                {item.details}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
