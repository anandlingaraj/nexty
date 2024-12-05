// app/admin/access/page.tsx
'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
    Users,
    Shield,
    Key,
    Settings,
    Plus,
    Edit,
    Trash,
    Search
} from "lucide-react";

interface Role {
    id: string;
    name: string;
    description: string;
    permissions: string[];
    users: number;
}

interface Permission {
    id: string;
    name: string;
    description: string;
    category: string;
}

// Sample data
const roles: Role[] = [
    {
        id: '1',
        name: 'Administrator',
        description: 'Full system access',
        permissions: ['all'],
        users: 5
    },
    {
        id: '2',
        name: 'Editor',
        description: 'Content management access',
        permissions: ['read', 'write', 'publish'],
        users: 12
    }
];

const permissions: Permission[] = [
    {
        id: '1',
        name: 'users.read',
        description: 'View user information',
        category: 'User Management'
    },
    {
        id: '2',
        name: 'users.write',
        description: 'Create and modify users',
        category: 'User Management'
    }
];

export default function AccessControlPage() {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Access Control</h1>
                    <p className="text-muted-foreground">
                        Manage roles, permissions, and access policies
                    </p>
                </div>
            </div>

            <Tabs defaultValue="roles">
                <TabsList>
                    <TabsTrigger value="roles">
                        <Shield className="mr-2 h-4 w-4" />
                        Roles
                    </TabsTrigger>
                    <TabsTrigger value="permissions">
                        <Key className="mr-2 h-4 w-4" />
                        Permissions
                    </TabsTrigger>
                    <TabsTrigger value="policies">
                        <Settings className="mr-2 h-4 w-4" />
                        Policies
                    </TabsTrigger>
                </TabsList>

                {/* Roles Tab */}
                <TabsContent value="roles">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Role Management</CardTitle>
                                    <CardDescription>
                                        Define and manage user roles and their permissions
                                    </CardDescription>
                                </div>
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button>
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Role
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Create New Role</DialogTitle>
                                            <DialogDescription>
                                                Define a new role and its permissions
                                            </DialogDescription>
                                        </DialogHeader>
                                        <RoleForm />
                                    </DialogContent>
                                </Dialog>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Input
                                        placeholder="Search roles..."
                                        className="max-w-sm"
                                        prefix={<Search className="h-4 w-4" />}
                                    />
                                </div>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Role Name</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead>Users</TableHead>
                                            <TableHead>Permissions</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {roles.map((role) => (
                                            <TableRow key={role.id}>
                                                <TableCell className="font-medium">
                                                    {role.name}
                                                </TableCell>
                                                <TableCell>{role.description}</TableCell>
                                                <TableCell>{role.users}</TableCell>
                                                <TableCell>
                                                    <div className="flex gap-1">
                                                        {role.permissions.map((perm) => (
                                                            <Badge key={perm} variant="secondary">
                                                                {perm}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        <Button variant="ghost" size="sm">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="sm">
                                                            <Trash className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Permissions Tab */}
                <TabsContent value="permissions">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Permissions</CardTitle>
                                    <CardDescription>
                                        System permissions and their assignments
                                    </CardDescription>
                                </div>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Add Permission
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Input
                                        placeholder="Search permissions..."
                                        className="max-w-sm"
                                    />
                                    <Select>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="user">User Management</SelectItem>
                                            <SelectItem value="content">Content Management</SelectItem>
                                            <SelectItem value="system">System</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead>Permission</TableHead>
                                            <TableHead>Description</TableHead>
                                            <TableHead>Category</TableHead>
                                            <TableHead>Actions</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {permissions.map((permission) => (
                                            <TableRow key={permission.id}>
                                                <TableCell className="font-medium">
                                                    {permission.name}
                                                </TableCell>
                                                <TableCell>{permission.description}</TableCell>
                                                <TableCell>
                                                    <Badge variant="outline">
                                                        {permission.category}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex gap-2">
                                                        <Button variant="ghost" size="sm">
                                                            <Edit className="h-4 w-4" />
                                                        </Button>
                                                        <Button variant="ghost" size="sm">
                                                            <Trash className="h-4 w-4" />
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Policies Tab */}
                <TabsContent value="policies">
                    <Card>
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <div>
                                    <CardTitle>Access Policies</CardTitle>
                                    <CardDescription>
                                        Configure fine-grained access control policies
                                    </CardDescription>
                                </div>
                                <Button>
                                    <Plus className="mr-2 h-4 w-4" />
                                    Create Policy
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="grid gap-4">
                                    <Card>
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-base">
                                                    Multi-factor Authentication
                                                </CardTitle>
                                                <Switch />
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground">
                                                Require MFA for sensitive operations and admin access
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-base">
                                                    IP Restrictions
                                                </CardTitle>
                                                <Switch />
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground">
                                                Limit access to specific IP ranges for enhanced security
                                            </p>
                                        </CardContent>
                                    </Card>

                                    <Card>
                                        <CardHeader>
                                            <div className="flex items-center justify-between">
                                                <CardTitle className="text-base">
                                                    Session Management
                                                </CardTitle>
                                                <Switch />
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-sm text-muted-foreground">
                                                Configure session timeouts and concurrent login policies
                                            </p>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}

// Form component for creating/editing roles
function RoleForm() {
    const onSubmit = (data: any) => {
        console.log(data);
    };

    return (
        <div className="space-y-4 py-4">
            <div className="space-y-2">
                <FormField
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Role Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Enter role name" {...field} />
                            </FormControl>
                            <FormDescription>
                                A unique name for this role
                            </FormDescription>
                        </FormItem>
                    )}
                />
            </div>

            <div className="space-y-2">
                <FormField
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Input placeholder="Role description" {...field} />
                            </FormControl>
                        </FormItem>
                    )}
                />
            </div>

            <div className="space-y-2">
                <h4 className="text-sm font-medium">Permissions</h4>
                <ScrollArea className="h-[200px] rounded-md border p-4">
                    <div className="space-y-2">
                        {permissions.map((permission) => (
                            <div key={permission.id} className="flex items-center space-x-2">
                                <Checkbox id={permission.id} />
                                <label
                                    htmlFor={permission.id}
                                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                >
                                    {permission.name}
                                </label>
                            </div>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline">Cancel</Button>
                <Button onClick={onSubmit}>Create Role</Button>
            </div>
        </div>
    );
}