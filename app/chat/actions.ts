//app/chat/actions.ts
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

export async function deleteChatAction(id: number) {
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
        let messages;

        if (sessionType === 'default') {
            messages = await prisma.conversation_memory.findMany({
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
        } else if (sessionType === 'analyser') {
            messages = await prisma.analyser_conversation_memory.findMany({
                // same options as above
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
        } else {
            messages = await prisma.web_analyser_conversation_memory.findMany({
                // same options as above
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
        }

        return messages.flatMap((msg) => ([
            { sender: 'user', content: msg.user_input, timestamp: msg.timestamp  } as Message,
            { sender: 'bot', content: msg.bot_response, timestamp: msg.timestamp  } as Message
        ]));

    } catch (error) {
        console.error('Error fetching session messages:', error);
        return [];
    }
}