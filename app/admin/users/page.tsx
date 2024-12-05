'use client';

import {useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UserTable } from "@/components/admin/users/components//user-table";
import { CreateUserForm } from "@/components/admin/users/components/create-user-form";
import { BulkUploadForm } from "@/components/admin/users/components//bulk-upload-form";
import { User } from "./types";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const response = await fetch('/app/api/users/read');
            const data = await response.json();
            setUsers(data);
        };
        fetchUsers();
    }, []);

    const createUser = async (userData: User) => {
        try {
        const response = await fetch('/app/api/users/create', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
        });
        const newUser = await response.json();
        setUsers([...users, newUser]);
        } catch (error) {
            console.error('Error creating user:', error);
           
        }
    };

    const updateUser = async (id: string, userData: Partial<User>) => {
        const response = await fetch('/app/api/users/update', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, ...userData }),
        });
        const updatedUser = await response.json();
        setUsers(
            users.map((user) => (user.id === updatedUser.id ? updatedUser : user))
        );
    };

    const deleteUser = async (id: string) => {
        await fetch('/api/users', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
        });
        setUsers(users.filter((user) => user.id !== id));
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
                            <UserTable users={users} onDelete={deleteUser} />
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
