// app/api/login-history/route.ts
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';
import { z } from 'zod';
import { authOptions } from '@/lib/auth/auth-options';

const prisma = new PrismaClient();
const loginHistorySchema = z.object({
    deviceName: z.string(),
    location: z.string(),
    ipAddress: z.string(),
    deviceType: z.enum(['LAPTOP', 'SMARTPHONE', 'TABLET', 'DESKTOP', 'OTHER']),
    isCurrentDevice: z.boolean().optional(),
});

// GET /api/login-history
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const loginHistory = await prisma.loginHistory.findMany({
            where: {
                user: {
                    email: session.user.email
                }
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 5 // Get last 5 logins
        });

        return NextResponse.json(loginHistory);
    } catch (error) {
        console.error('Failed to fetch login history:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

// POST /api/login-history
export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const json = await req.json();
        const validatedData = loginHistorySchema.parse(json);

        // If this is a current device, unset any existing current devices
        if (validatedData.isCurrentDevice) {
            await prisma.loginHistory.updateMany({
                where: {
                    user: {
                        email: session.user.email
                    },
                    isCurrentDevice: true
                },
                data: {
                    isCurrentDevice: false
                }
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email
            }
        });

        if (!user) {
            return new NextResponse('User not found', { status: 404 });
        }

        const loginHistory = await prisma.loginHistory.create({
            data: {
                ...validatedData,
                userId: user.id
            }
        });

        return NextResponse.json(loginHistory);
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ errors: error.errors }, { status: 400 });
        }
        console.error('Failed to create login history:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}

// DELETE /api/login-history
export async function DELETE(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.email) {
            return new NextResponse('Unauthorized', { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) {
            return new NextResponse('Missing login history ID', { status: 400 });
        }

        const user = await prisma.user.findUnique({
            where: {
                email: session.user.email
            }
        });

        if (!user) {
            return new NextResponse('User not found', { status: 404 });
        }

        // Ensure the login history belongs to the user
        const loginHistory = await prisma.loginHistory.findFirst({
            where: {
                id,
                userId: user.id
            }
        });

        if (!loginHistory) {
            return new NextResponse('Login history not found', { status: 404 });
        }

        await prisma.loginHistory.delete({
            where: {
                id
            }
        });

        return new NextResponse(null, { status: 204 });
    } catch (error) {
        console.error('Failed to delete login history:', error);
        return new NextResponse('Internal Server Error', { status: 500 });
    }
}