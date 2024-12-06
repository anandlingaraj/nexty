'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTrigger,
} from "@/components/ui/sheet";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuLabel,
    DropdownMenuTrigger,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useTheme } from "next-themes";
import {
    Settings,
    Moon,
    Sun,
    Monitor,
    HelpCircle,
    Download,
    LogOut,
    ChevronRight,
    ExternalLink,
    ChevronDown
} from "lucide-react";
import { useRouter } from 'next/navigation';

export default function UserMenu() {
    const email = "anand.lingaraj@gmail.com";
    const initials = email.substring(0, 1).toUpperCase();
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const [themeOpen, setThemeOpen] = React.useState(false);

    const handleAdminPage = () => {
        router.push('/admin/dashboard');
    };

    return (
        <div className="fixed bottom-4 left-4 z-50">
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="ghost" className="gap-2 h-12">
                        <Avatar className="h-8 w-8">
                            <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col items-start text-sm">
                            <span>Personal</span>
                            <span className="text-xs text-muted-foreground">Pro plan</span>
                        </div>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 p-0">
                    <SheetHeader className="p-4 border-b">
                        <div className="flex items-center gap-2">
                            <Avatar className="h-10 w-10">
                                <AvatarFallback>{initials}</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                                <span>Personal</span>
                                <span className="text-sm text-muted-foreground">Pro plan</span>
                            </div>
                            <ChevronDown className="ml-auto h-4 w-4" />
                        </div>
                    </SheetHeader>

                    <div className="flex flex-col p-2">
                        <Button variant="ghost" className="justify-between" onClick={handleAdminPage}>
                            Settings
                            <ChevronRight className="h-4 w-4" />
                        </Button>

                        <DropdownMenu open={themeOpen} onOpenChange={setThemeOpen}>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="justify-between">
                                    Appearance
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="w-56">
                                <DropdownMenuLabel>Theme</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuRadioGroup value={theme} onValueChange={setTheme}>
                                    <DropdownMenuRadioItem value="light" className="gap-2">
                                        <Sun className="h-4 w-4" />
                                        Light
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="dark" className="gap-2">
                                        <Moon className="h-4 w-4" />
                                        Dark
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value="system" className="gap-2">
                                        <Monitor className="h-4 w-4" />
                                        System
                                    </DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuContent>
                        </DropdownMenu>

                        <Button variant="ghost" className="text-red-600 hover:text-red-600 hover:bg-red-100">
                            Log Out
                        </Button>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 border-t p-4">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="w-full justify-between">
                                    <div className="flex items-center gap-2">
                                        <Avatar className="h-8 w-8">
                                            <AvatarFallback>G</AvatarFallback>
                                        </Avatar>
                                        <span className="text-sm truncate">{email}</span>
                                    </div>
                                    <ChevronDown className="h-4 w-4" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start" className="w-72">
                                <DropdownMenuItem>
                                    Switch account
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    Add account
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    );
}