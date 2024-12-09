import { LogFilter } from "@/app/admin/logs/types";

export function buildLogQuery(filters: LogFilter) {
    const query: any = { AND: [] };

    if (filters.level?.length) {
        query.AND.push({ level: { in: filters.level } });
    }

    if (filters.action?.length) {
        query.AND.push({ action: { in: filters.action } });
    }

    if (filters.user?.length) {
        query.AND.push({ userId: { in: filters.user } });
    }

    if (filters.resource?.length) {
        query.AND.push({ resource: { in: filters.resource } });
    }

    if (filters.timeRange) {
        query.AND.push({
            timestamp: {
                gte: filters.timeRange.from,
                lte: filters.timeRange.to
            }
        });
    }

    if (filters.correlationId) {
        query.AND.push({ correlationId: filters.correlationId });
    }

    if (filters.search) {
        query.AND.push({
            OR: [
                { details: { contains: filters.search } },
                { action: { contains: filters.search } },
                { resource: { contains: filters.search } }
            ]
        });
    }

    return query.AND.length > 0 ? query : {};
}