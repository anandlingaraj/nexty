import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
        return NextResponse.json(
            { error: 'Session ID is required' },
            { status: 400 }
        );
    }

    try {
        const messages = await prisma.conversation_memory.findMany({
            where: {
                session_id: sessionId
            },
            orderBy: {
                timestamp: 'asc'
            }
        });

        return NextResponse.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        return NextResponse.json(
            { error: 'Failed to fetch messages' },
            { status: 500 }
        );
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { session_id, user_input } = body;

        const message = await prisma.conversation_memory.create({
            data: {
                session_id,
                user_input,
                bot_response: 'Sample response', // Replace with actual bot response
                timestamp: new Date()
            }
        });

        return NextResponse.json(message);
    } catch (error) {
        console.error('Error creating message:', error);
        return NextResponse.json(
            { error: 'Failed to create message' },
            { status: 500 }
        );
    }
}