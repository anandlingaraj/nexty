// components/layout/nav-bar.tsx
"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/ui/icons";
export function NavBar() {
    return (
        <nav className="border-b">
            <div className="container mx-auto flex h-16 items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    {/*<img*/}
                    {/*    src="/logo.png"*/}
                    {/*    alt="Logo"*/}
                    {/*    className="h-8 w-8"*/}
                    {/*/>*/}
                    <div className="flex items-center justify-center">
                        <Icons.logo className="h-5 w-5 text-indigo-600"/>
                    </div>
                </Link>

                <div className="flex items-center gap-6">
                    <Link href="/api-docs" className="text-sm">
                        API Docs
                    </Link>
                    <Link href="/release-notes" className="text-sm">
                        Release Notes
                    </Link>
                    <Link href="/support" className="text-sm">
                        How to Get Support
                    </Link>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="gap-2">
                                <Globe className="h-4 w-4" />
                                English
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuItem>English</DropdownMenuItem>
                            <DropdownMenuItem>Français</DropdownMenuItem>
                            <DropdownMenuItem>Deutsch</DropdownMenuItem>
                            <DropdownMenuItem>Español</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </nav>
    );
}