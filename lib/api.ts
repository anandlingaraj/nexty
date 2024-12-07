// lib/api.ts
export async function uploadFileToS3(file: File, userId: string): Promise<string> {
    // Get S3 credentials
    const credentialsResponse = await fetch(`/api/storage/credentials?user_id=${userId}`);
    const { uploadUrl, fields } = await credentialsResponse.json();

    // Prepare form data
    const formData = new FormData();
    Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value);
    });
    formData.append('file', file);

    // Upload to S3
    const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        body: formData
    });

    if (!uploadResponse.ok) {
        throw new Error('Failed to upload file');
    }

    return uploadResponse.url;
}

export async function startNewSession(): Promise<string> {
    const response = await fetch('/api/chat/session', {
        method: 'POST'
    });

    if (!response.ok) {
        throw new Error('Failed to start new session');
    }

    const { session_id } = await response.json();
    return session_id;
}

// app/api/chat/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const userId = searchParams.get('user_id');
    const sessionId = searchParams.get('session_id');

    const PYTHON_API = process.env.PYTHON_API_URL;

    try {
        switch (action) {
            case 'list_sessions':
                const sessionsResponse = await fetch(
                    `${PYTHON_API}/users/${userId}/list_sessions`
                );
                const sessions = await sessionsResponse.json();
                return NextResponse.json(sessions);

            case 'get_session_messages':
                const messagesResponse = await fetch(
                    `${PYTHON_API}/get_session_messages?user_id=${userId}&session_id=${sessionId}&session_type=default`
                );
                const messages = await messagesResponse.json();
                return NextResponse.json(messages);

            default:
                return NextResponse.json(
                    { error: 'Invalid action' },
                    { status: 400 }
                );
        }
    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}