// lib/login-history.ts
import { LoginHistoryEntry } from '@/types/login-history';

export async function recordLoginHistory(data: LoginHistoryEntry) {
    const response = await fetch('/api/login-history', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error('Failed to record login history');
    }

    return response.json();
}

export async function getLoginHistory() {
    const response = await fetch('/api/login-history');

    if (!response.ok) {
        throw new Error('Failed to fetch login history');
    }

    return response.json();
}