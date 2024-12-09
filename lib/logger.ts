import { prisma } from "./prisma";

export async function createLog({
                                    level,
                                    action,
                                    details,
                                    userId,
                                    resource,
                                    metadata
                                }: {
    level: string;
    action: string;
    details: string;
    userId: string;
    resource: string;
    metadata?: any;
}) {
    return prisma.log.create({
        data: {
            level,
            action,
            details,
            userId,
            resource,
            metadata
        }
    });
}

