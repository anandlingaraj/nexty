// app/api/users/route.ts
import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client';
import { Client } from '@microsoft/microsoft-graph-client';
import { TokenCredentialAuthenticationProvider } from "@microsoft/microsoft-graph-client/authProviders/azureTokenCredentials";
import { ClientSecretCredential } from '@azure/identity'
const prisma = new PrismaClient();

const B2C_TENANT_ID = process.env.AZURE_AD_B2C_TENANT_ID!;
const CLIENT_ID = process.env.MS_GRAPH_CLIENT_ID!;
const CLIENT_SECRET = process.env.MS_GRAPH_CLIENT_SECRET!;

const credential = () => new ClientSecretCredential(B2C_TENANT_ID, CLIENT_ID, CLIENT_SECRET);

const authProvider =() => new TokenCredentialAuthenticationProvider(credential(), {
    scopes: ['https://graph.microsoft.com/.default'],
});

const graphClient = () => authProvider()
    Client.initWithMiddleware({ authProvider: authProvider() });

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                createdAt: true
            }
        });

        return NextResponse.json(users);
    } catch (error) {
        console.error('Error fetching users:', error);
        return NextResponse.json(
            { error: 'Failed to fetch users' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

export async function POST(request: Request) {
    try {
        const userData = await request.json();
        console.log("UD", JSON.stringify(userData))
        const { name, email, role, status } = userData;
        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                role,
                status,
                id: Math.random().toString(36).substr(2, 9),
                createdAt: new Date()
            },
        });
        const GraphUser = {
            accountEnabled: true,
            displayName: name,
            mailNickname: name,
            userPrincipalName:  email || `${name}@hubseven.onmicrosoft.com`,
            passwordProfile: {
                forceChangePasswordNextSignIn: false,
                password: 'xWwvJ]6NMw+bWH-d'
            }
        };

        await graphClient().api('/users').post(GraphUser);

        return NextResponse.json(newUser,{ status: 201 });
    } catch (error) {
        console.error('API Error:', error);
        return NextResponse.json({ message: 'Internal server error', error: error });
    }
}
export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();

        const deletedUser = await prisma.user.delete({
            where: { id }
        });

        return NextResponse.json({
            success: true,
            message: 'User deleted successfully',
            user: deletedUser
        });

    } catch (error) {
        console.error('Error deleting user:', error);
        return NextResponse.json(
            { error: 'Failed to delete user' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

export async function PATCH(request: Request) {
    try {
        const userData = await request.json();
        const { id, ...updateData } = userData;

        const updatedUser = await prisma.user.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                status: true,
                createdAt: true
            }
        });

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error('Error updating user:', error);
        return NextResponse.json(
            { error: 'Failed to update user' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}