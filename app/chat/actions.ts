// app/actions.ts
'use server';

import { ConversationType, Message } from '@/types/chat';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function fetchConversationsAction() {
    try {
        const conversations = await prisma.conversation_memory.findMany({
            orderBy: {
                timestamp: 'desc'
            },
            distinct: ['session_id'],
            where: {
                session_id: {
                    not: null
                }
            }
        });

        return conversations;
    } catch (error) {
        console.error('Error fetching conversations:', error);
        throw new Error('Failed to fetch conversations');
    }
}

// app/actions.ts
export async function createChatAction() {
    try {
        const chat = await prisma.chat.create({
            data: {
                title: 'New Chat'
            }
        });
        return chat;
    } catch (error) {
        throw new Error('Failed to create chat');
    }
}

export async function updateChatAction(id: string, data: { title?: string; lastMessage?: string }) {
    try {
        const chat = await prisma.chat.update({
            where: { id },
            data
        });
        return chat;
    } catch (error) {
        throw new Error('Failed to update chat');
    }
}

export async function deleteChatAction(id: string) {
    try {
        await prisma.conversation_memory.delete({
            where: { id }
        });
    } catch (error) {
        throw new Error('Failed to delete chat');
    }
}

export async function getSessionMessagesAction(
    userId: string,
    sessionId: string,
    sessionType: ConversationType
): Promise<Message[]> {
    try {
        console.log("GRAB SESSUIB", userId, sessionId, sessionType)
        const table = sessionType === 'default' ? 'conversation_memory' :
            sessionType === 'analyser' ? 'analyser_conversation_memory' :
                'web_analyser_conversation_memory';

        const messages = await prisma[table].findMany({
            where: {
                session_id: sessionId,
                user_id: userId
            },
            select: {
                user_input: true,
                bot_response: true,
                timestamp: true
            },
            orderBy: {
                timestamp: 'asc'
            }
        });

        // Transform the data into the required format
        return messages.flatMap((msg: { user_input: any; bot_response: any; }) => ([
            { sender: 'user', text: msg.user_input },
            { sender: 'bot', text: msg.bot_response }
        ]));

    } catch (error) {
        console.error('Error fetching session messages:', error);
        return [];
    }
}
