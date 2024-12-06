// app/admin/users/actions.ts
'use server';
import { User } from './types';
export async function deleteUserAction(id: string) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
        });

        if (!response.ok) throw new Error('Failed to delete user');
        return await response.json();
    } catch (error) {
        throw new Error('Failed to delete user');
    }
}

export async function updateUserAction(id: string, userData: Partial<User>) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, ...userData }),
        });

        if (!response.ok) throw new Error('Failed to update user');
        return await response.json();
    } catch (error) {
        throw new Error('Failed to update user');
    }
}

export async function createUserAction(userData: User) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });
        if (!response.ok) throw new Error('Failed to create user');
        return await response.json();
    } catch (error) {
        throw new Error('Failed to create user');
    }
}

export async function fetchUsersAction() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`);
        if (!response.ok) throw new Error('Failed to fetch users');
        return await response.json();
    } catch (error) {
        throw new Error('Failed to fetch users');
    }
}