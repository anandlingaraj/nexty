// components/profile/ProfileContent.tsx
'use client';

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { User, Phone, Lock, Shield } from "lucide-react";
import { PasswordChangeDialog } from "./PasswordChangeDialog";

interface UserClaims {
    given_name?: string;
    family_name?: string;
    email?: string;
    phone?: string;
    mobile?: string;
    picture?: string;
}

export function ProfileContent() {
    const { data: session } = useSession();
    const [claims, setClaims] = useState<UserClaims | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isMFAEnabled, setIsMFAEnabled] = useState(false);
    const [editableData, setEditableData] = useState<UserClaims | null>(null);

    useEffect(() => {
        if (session?.idToken) {
            const decodedClaims = jwtDecode(session.idToken) as UserClaims;
            setClaims(decodedClaims);
            setEditableData(decodedClaims);
        }
    }, [session]);

    const handleSaveProfile = async () => {
        // Implement profile update logic
        setIsEditing(false);
    };

    const handleChangePassword = () => {

    };

    const handleMFAToggle = (enabled: boolean) => {
        setIsMFAEnabled(enabled);
        // Implement MFA toggle logic
    };

    if (!session) {
        return <div className="flex items-center justify-center h-40">Loading...</div>;
    }

    return (
        <div className="container max-w-4xl py-8">
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl font-semibold">Profile Settings</CardTitle>
                        <Button
                            variant={isEditing ? "default" : "outline"}
                            onClick={() => setIsEditing(!isEditing)}
                        >
                            {isEditing ? "Save Changes" : "Edit Profile"}
                        </Button>
                    </div>
                </CardHeader>

                <CardContent className="space-y-6">
                    {/* Profile Picture Section */}
                    <div className="flex items-center space-x-4">
                        <Avatar className="h-20 w-20">
                            <AvatarImage src={claims?.picture}/>
                            <AvatarFallback>
                                <User className="h-10 w-10"/>
                            </AvatarFallback>
                        </Avatar>
                        {isEditing && (
                            <Input
                                type="url"
                                placeholder="Profile picture URL"
                                className="max-w-sm"
                                value={editableData?.picture || ''}
                                onChange={(e) => setEditableData(prev => ({...prev!, picture: e.target.value}))}
                            />
                        )}
                    </div>

                    <Separator/>

                    {/* Personal Information */}
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <Label>First Name</Label>
                            {isEditing ? (
                                <Input
                                    value={editableData?.given_name || ''}
                                    onChange={(e) => setEditableData(prev => ({...prev!, given_name: e.target.value}))}
                                />
                            ) : (
                                <p className="py-2">{claims?.given_name}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Last Name</Label>
                            {isEditing ? (
                                <Input
                                    value={editableData?.family_name || ''}
                                    onChange={(e) => setEditableData(prev => ({...prev!, family_name: e.target.value}))}
                                />
                            ) : (
                                <p className="py-2">{claims?.family_name}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Email</Label>
                            <p className="py-2">{claims?.email}</p>
                        </div>

                        <div className="space-y-2">
                            <Label>Phone</Label>
                            {isEditing ? (
                                <Input
                                    value={editableData?.phone || ''}
                                    onChange={(e) => setEditableData(prev => ({...prev!, phone: e.target.value}))}
                                />
                            ) : (
                                <p className="py-2">{claims?.phone || 'Not set'}</p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <Label>Mobile</Label>
                            {isEditing ? (
                                <Input
                                    value={editableData?.mobile || ''}
                                    onChange={(e) => setEditableData(prev => ({...prev!, mobile: e.target.value}))}
                                />
                            ) : (
                                <p className="py-2">{claims?.mobile || 'Not set'}</p>
                            )}
                        </div>
                    </div>

                    <Separator/>

                    {/* Security Settings */}
                    <div className="space-y-4">
                        {/* Password Change */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                                <Lock className="h-4 w-4"/>
                                <div className="space-y-0.5">
                                    <Label>Password Settings</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Manage your password and security settings
                                    </p>
                                </div>
                            </div>
                            <PasswordChangeDialog/>
                        </div>

                    {/**/}

                    {/* MFA Toggle */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Shield className="h-4 w-4"/>
                            <div className="space-y-0.5">
                                <Label>Multi-Factor Authentication</Label>
                                <p className="text-sm text-muted-foreground">
                                    Additional security for your account
                                </p>
                            </div>
                        </div>
                        <Switch
                            checked={isMFAEnabled}
                            onCheckedChange={handleMFAToggle}
                        />
                    </div>
        </div>
</CardContent>
</Card>
</div>
)
    ;
}