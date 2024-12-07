// app/api/chat/route.ts
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const userId = searchParams.get('user_id');
    const sessionId = searchParams.get('session_id');

    const PYTHON_API = process.env.PYTHON_API_URL;

    try {
        if (action === 'list_sessions') {
            const response = await fetch(`${PYTHON_API}/users/${userId}/list_sessions`);
            const data = await response.json();
            return NextResponse.json(data);
        }

        if (action === 'get_session_messages') {
            const response = await fetch(
                `${PYTHON_API}/get_session_messages?user_id=${userId}&session_id=${sessionId}&session_type=default`
            );
            const data = await response.json();
            return NextResponse.json(data);
        }
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to process request' },
            { status: 500 }
        );
    }
}