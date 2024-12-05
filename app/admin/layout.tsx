import SidebarNav from "@/components/admin/sidebar/page";

import {
    Users,
    Database,
    Settings,
    LayoutDashboard,
    Files,
    AlertCircle,
    BarChart3,
    Lock
} from "lucide-react";
import React from "react";

export default function AdminLayout({
                                        children,
                                    }: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen">
            {/* Sidebar */}
            <div className="flex w-64 flex-col border-r bg-background">
                {/* Sidebar Header */}
                <div className="flex h-14 items-center gap-2 border-b px-4">
                    <Settings className="h-5 w-5" />
                    <h2 className="font-semibold">Administration</h2>
                </div>

                {/* Sidebar Navigation */}
                <div className="flex flex-1 flex-col">
                    <SidebarNav />
                </div>

                {/* Sidebar Footer */}
                <div className="border-t p-4">
                    <div className="flex items-center gap-2 rounded-md bg-muted p-2 text-xs text-muted-foreground">
                        <AlertCircle className="h-4 w-4" />
                        <span>Admin Console v1.0</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex flex-1 flex-col">
                <main className="flex-1 overflow-y-auto p-6">
                    {children}
                </main>
            </div>
        </div>
    );
}