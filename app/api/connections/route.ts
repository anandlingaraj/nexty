// app/api/connections/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import {v4} from "uuid";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const connections = await prisma.connections.findMany({
            orderBy: {
                created_at: 'desc',
            },
            select: {
                id: true,
                user_id: true,
                name: true,
                type: true,
                meta_data: true,
                is_active: true,
                created_at: true,
                modified_at: true,
            },
        });

        return NextResponse.json(connections);
    } catch (error) {
        console.error('Error fetching connections:', error);
        return NextResponse.json(
            { error: 'Failed to fetch connections' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

export async function POST(request: Request) {
    try {
        const connectionData = await request.json();
        const { user_id, name, type, credentials } = connectionData;

        const newConnection = await prisma.connections.create({
            data: {
                id: v4(),
                user_id,
                name,
                type,
                meta_data:credentials,
                is_active:true,
                created_at: new Date(),
                modified_at: new Date(),
            },
        });

        return NextResponse.json(newConnection, { status: 201 });
    } catch (error) {
        console.error('Error creating connection:', error);
        return NextResponse.json(
            { error: 'Failed to create connection' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();

        const deletedConnection = await prisma.connections.delete({
            where: { id },
        });

        return NextResponse.json({
            success: true,
            message: 'Connection deleted successfully',
            connection: deletedConnection,
        });
    } catch (error) {
        console.error('Error deleting connection:', error);
        return NextResponse.json(
            { error: 'Failed to delete connection' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}

export async function PATCH(request: Request) {
    try {
        const connectionData = await request.json();
        const { id, ...updateData } = connectionData;

        const updatedConnection = await prisma.connections.update({
            where: { id },
            data: updateData,
            select: {
                id: true,
                user_id: true,
                name: true,
                type: true,
                meta_data: true,
                is_active: true,
                created_at: true,
                modified_at: true,
            },
        });

        return NextResponse.json(updatedConnection);
    } catch (error) {
        console.error('Error updating connection:', error);
        return NextResponse.json(
            { error: 'Failed to update connection' },
            { status: 500 }
        );
    } finally {
        await prisma.$disconnect();
    }
}
