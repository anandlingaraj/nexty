// app/admin/layout.tsx
'use client';
import React from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import {
    Users,
    Database,
    Settings,
    LayoutDashboard,
    Files,
    AlertCircle,
    BarChart3,
    Lock,
    MessageSquare
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const sidebarNavItems = [
    {
        title: "Dashboard",
        href: "/admin/dashboard",
        icon: LayoutDashboard
    },
    {
        title: "Users",
        href: "/admin/users",
        icon: Users
    },
    {
        title: "Storage Sources",
        href: "/admin/storage",
        icon: Database
    },
    {
        title: "Documents",
        href: "/admin/documents",
        icon: Files
    },
    {
        title: "Analytics",
        href: "/admin/analytics",
        icon: BarChart3
    },
    {
        title: "Chat",
        href: "/chat",
        icon: MessageSquare
    },
    {
        title: "Access Control",
        href: "/admin/access",
        icon: Lock
    },
    {
        title: "Audit Logs",
        href: "/admin/logs",
        icon: AlertCircle
    }
];

function SidebarNav() {
    const pathname = usePathname();

    return (
        <ScrollArea className="flex-1">
            <div className="space-y-1 p-2">
                {sidebarNavItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Button
                            key={item.href}
                            variant={pathname === item.href ? "secondary" : "ghost"}
                            className={cn(
                                "w-full justify-start gap-2",
                                pathname === item.href ? "bg-accent" : "hover:bg-accent/50"
                            )}
                            asChild
                        >
                            <Link href={item.href}>
                                <Icon className="h-4 w-4" />
                                {item.title}
                            </Link>
                        </Button>
                    );
                })}
            </div>
        </ScrollArea>
    );
}

export default SidebarNav;