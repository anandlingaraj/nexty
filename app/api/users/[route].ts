import { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    const { route } = req.query;

    switch (route) {
        case 'create':
            // Handle create user request
            const { name, email, role, status } = req.body;
            const newUser = await prisma.user.create({
                data: {
                    name,
                    email,
                    role,
                    status,
                },
            });
            res.status(200).json(newUser);
            break;
        case 'read':
            // Handle read users request
            const users = await prisma.user.findMany();
            res.status(200).json(users);
            break;
        case 'update':
            // Handle update user request
            const { id, ...userData } = req.body;
            const updatedUser = await prisma.user.update({
                where: { id },
                data: userData,
            });
            res.status(200).json(updatedUser);
            break;
        case 'delete':
            // Handle delete user request
            const { userId } = req.body;
            await prisma.user.delete({ where: { id: userId } });
            res.status(200).json({ message: 'User deleted' });
            break;
        default:
            res.status(404).json({ message: 'Route not found' });
            break;
    }
}