// components/layout/top-menubar.tsx
"use client";

import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Laptop, Moon, Sun, MoreHorizontal, Settings, HelpCircle, Menu, Settings2 } from "lucide-react";
import { useTheme } from "next-themes";
import { Icons } from "@/components/ui/icons";
import { useRouter, useParams } from "next/navigation";

import { redirect } from "next/navigation";
import { LogoutButton } from "../auth/logout-button";
import {signOut, useSession } from "next-auth/react";

export function TopMenuBar() {
    const {setTheme} = useTheme();
    const router = useRouter();
    const { data: session, status } = useSession();
    

    const handleLogout = async () => {
        await signOut({
            redirect: true,
            callbackUrl: "/login"
        });
    };

    return (
        <div
            className="sticky top-0 z-50 flex h-16 w-full shrink-0 items-center justify-between border-b bg-background px-4">
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5"/>
                </Button>
                <div className="flex items-center gap-2">
                    <div className="flex items-center justify-center">
                        <Icons.logo className="h-5 w-5 text-indigo-600"/>
                    </div>
                    <span className="text-lg font-semibold">Reveal</span>
                </div>
            </div>

            <div className="flex items-center gap-2">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"/>
                            <Moon
                                className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"/>
                            <span className="sr-only">Toggle theme</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setTheme("light")}>
                            <Sun className="mr-2 h-4 w-4"/>
                            Light
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("dark")}>
                            <Moon className="mr-2 h-4 w-4"/>
                            Dark
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => setTheme("system")}>
                            <Laptop className="mr-2 h-4 w-4"/>
                            System
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>

                <Button variant="ghost" size="icon" onClick={() => router.push('/help')}>
                    <HelpCircle className="h-5 w-5"/>
                </Button>

                <Button variant="ghost" size="icon" onClick={() => router.push('/admin/dashboard')}>
                    <Settings2 className="h-5 w-5"/>
                </Button>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-5 w-5"/>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem>Your Organizations</DropdownMenuItem>
                        <DropdownMenuItem>API Keys</DropdownMenuItem>
                        <DropdownMenuItem onClick={()=>router.push('/settings/profile')}>Settings</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={handleLogout}>LogOut</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </div>
    );
}