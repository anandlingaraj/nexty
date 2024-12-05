import { LogFilter } from "@/app/admin/logs/types";

export const parseSearchQuery = (query: string): LogFilter => {
    const filters: LogFilter = {};
    const parts = query.match(/(?:[^\s"]+|"[^"]*")+/g) || [];

    parts.forEach(part => {
        if (part.includes(':')) {
            const [key, value] = part.split(':');
            switch (key) {
                case 'level':
                    filters.level = [value];
                    break;
                case 'user':
                    filters.user = [value.replace(/"/g, '')];
                    break;
                case 'action':
                    filters.action = [value];
                    break;
                // Add more search operators
            }
        }
    });

    return filters;
};