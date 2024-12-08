'use client';
import React from 'react';
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Key } from "lucide-react";
import PasswordChangeForm  from "./PasswordChangeForm";

export const PasswordChangeDialog = () => {
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                    <Key className="h-4 w-4" />
                    Change Password
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Change Password</DialogTitle>
                </DialogHeader>
                <PasswordChangeForm />
            </DialogContent>
        </Dialog>
    );
};