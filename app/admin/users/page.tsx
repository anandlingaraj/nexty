'use client';

import {useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserTable } from "@/components/admin/users/components/user-table";
import { CreateUserForm } from "@/components/admin/users/components/create-user-form";
import { BulkUploadForm } from "@/components/admin/users/components/bulk-upload-form";
import { User } from "./types";
import { deleteUserAction,createUserAction, fetchUsersAction } from './actions';
import { toast } from '@/hooks/use-toast';
export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);

    const [loading, setLoading] = useState(true);

    const fetchUsers = async () => {
        try {
            const data = await fetchUsersAction();
            setUsers(data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const createUser = async (userData: User) => {
        try {
            await createUserAction(userData);
            await fetchUsers();
            toast({
                title: "Success",
                description: "User created successfully",
            });
        } catch (error) {
            console.error('Error creating user:', error);
            toast({
                title: "Error",
                description: "Failed to create user",
                variant: "destructive",
            });
        }
    };


    const deleteUser = async (id: string) => {
        try {
            await deleteUserAction(id);
            setUsers(users.filter((user) => user.id !== id));
            toast({
                title: "Success",
                description: "User deleted successfully",
            });
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to delete user",
                variant: "destructive",
            });
        }
    };


    return (
        <div className="container mx-auto py-8">
            <h1 className="mb-8 text-3xl font-bold">User Management</h1>

            <Tabs defaultValue="list">
                <TabsList className="mb-4">
                    <TabsTrigger value="list">Users List</TabsTrigger>
                    <TabsTrigger value="create">Create User</TabsTrigger>
                    <TabsTrigger value="bulk">Bulk Upload</TabsTrigger>
                </TabsList>

                <TabsContent value="list">
                    <Card>
                        <CardHeader>
                            <CardTitle>Users</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {loading ? (
                                <div className="flex items-center justify-center p-4">
                                    Loading users...
                                </div>
                            ) : (
                                <UserTable users={users} onDeleteAction={deleteUser} onUpdateAction={fetchUsers}  />
                            )}
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="create">
                    <Card>
                        <CardHeader>
                            <CardTitle>Create New User</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <CreateUserForm onSubmit={createUser} />
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="bulk">
                    <Card>
                        <CardHeader>
                            <CardTitle>Bulk Upload Users</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <BulkUploadForm onUpload={(newUsers) => setUsers([...users, ...newUsers])} />
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
