// components/chat/StatusIndicators.tsx
import { useEffect } from "react";
import { Progress } from "@/components/ui/progress";
import { Loader2} from "lucide-react";
import React from "react";

interface LoadingIndicatorProps {
    loading: boolean;
}

export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({ loading }) => {
    const [progress, setProgress] = React.useState(10);

    useEffect(() => {
        if (loading) {
            const timer = setInterval(() => {
                setProgress((prevProgress) => {
                    if (prevProgress >= 95) {
                        return 95;
                    }
                    return prevProgress + 5;
                });
            }, 500);

            return () => {
                clearInterval(timer);
                setProgress(10);
            };
        }
    }, [loading]);

    if (!loading) return null;

    return (
        <div className="fixed inset-x-0 top-0 z-50 transition-all duration-300">
            <div className="space-y-2 p-4 backdrop-blur-sm bg-background/80">
                <div className="flex items-center justify-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-sm text-muted-foreground">Processing your request...</span>
                </div>
                <Progress
                    value={progress}
                    className="h-1 w-full transition-all duration-300"
                />
            </div>
        </div>
    );
};
