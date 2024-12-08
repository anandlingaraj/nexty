'use client';
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LogOut, Download, Trash2, Moon, Sun, Smartphone, Laptop, Monitor  } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { LogoutButton } from '../auth/logout-button';

const AccountSettings = () => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    const toggleTheme = () => {
        setIsDarkMode(!isDarkMode);
        document.documentElement.classList.toggle('dark');
    };

    const recentLogins = [
        {
            device: "MacBook Pro",
            location: "San Francisco, US",
            ip: "192.168.1.1",
            timestamp: "2024-12-08 14:23",
            icon: Laptop,
            isCurrentDevice: true
        },
        {
            device: "iPhone 15",
            location: "San Francisco, US",
            ip: "192.168.1.2",
            timestamp: "2024-12-07 09:15",
            icon: Smartphone
        },
        {
            device: "Windows Desktop",
            location: "San Francisco, US",
            ip: "192.168.1.3",
            timestamp: "2024-12-06 18:45",
            icon: Monitor
        },
        {
            device: "iPad Pro",
            location: "New York, US",
            ip: "192.168.1.4",
            timestamp: "2024-12-05 11:30",
            icon: Smartphone
        },
        {
            device: "Chrome Browser",
            location: "Boston, US",
            ip: "192.168.1.5",
            timestamp: "2024-12-04 16:20",
            icon: Monitor
        }
    ];
    const handleCleanTokens=()=>{}

    return (
        <div className="min-h-screen p-8">
            <div className="max-w-2xl mx-auto">
                <h1 className="text-3xl font-semibold mb-8">Account</h1>

                <Card>
                    <CardContent className="pt-6 space-y-6">
                        {/* Theme Toggle Section */}
                        <div className="flex items-center justify-between py-4 border-b">
                            <div>
                                <h2 className="text-xl">Theme Preferences</h2>
                            </div>
                            <div className="flex items-center gap-2">
                                <Sun className="h-4 w-4" />
                                <Switch
                                    checked={isDarkMode}
                                    onCheckedChange={toggleTheme}
                                    aria-label="Toggle theme"
                                />
                                <Moon className="h-4 w-4" />
                            </div>
                        </div>

                        {/* Export Data Section */}
                        <div className="flex items-center justify-between py-4 border-b">
                            <div>
                                <h2 className="text-xl">Export data</h2>
                            </div>
                            <Button variant="outline" className="flex items-center gap-2">
                                <Download className="h-4 w-4" />
                                Export Data
                            </Button>
                        </div>

                        {/* Log Out Section */}
                        <div className="flex items-center justify-between py-4 border-b">
                            <div>
                                <h2 className="text-xl">Log Out of All Devices</h2>
                            </div>
                            <LogoutButton/>
                            {/*<Button variant="outline" className="flex items-center gap-2" onClick={handleCleanTokens}>*/}
                            {/*    <LogOut className="h-4 w-4" />*/}
                            {/*    Log Out*/}
                            {/*</Button>*/}
                        </div>

                        {/* Recent Login Activity */}
                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-muted-foreground">Recent Login Activity</h3>
                            <div className="space-y-3">
                                {recentLogins.map((login, index) => {
                                    const Icon = login.icon;
                                    return (
                                        <div key={index} className="flex items-start gap-4 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                                            <div className="p-2 rounded-full bg-secondary">
                                                <Icon className="h-4 w-4" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <p className="font-medium">{login.device}</p>
                                                    {login.isCurrentDevice && (
                                                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                                Current Device
                              </span>
                                                    )}
                                                </div>
                                                <div className="text-sm text-muted-foreground">
                                                    <p>{login.location} • {login.ip}</p>
                                                    <p>{login.timestamp}</p>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
            

                        {/* Delete Account Section */}
                        <div className="flex items-center justify-between py-4">
                            <div>
                                <h2 className="text-xl">Delete Account</h2>
                                <p className="text-sm text-muted-foreground mt-1">
                                    To delete your account, please cancel your Hubseven subscription.
                                </p>
                            </div>
                            <Button
                                variant="destructive"
                                className="flex items-center gap-2"
                                disabled
                            >
                                <Trash2 className="h-4 w-4" />
                                Delete Account
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default AccountSettings;