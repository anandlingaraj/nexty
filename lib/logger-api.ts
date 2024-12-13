export async function createLog(data: {
    level: string;
    action: string;
    details: string;
    userId: string;
    resource: string;
    metadata?: any;
}) {
    return fetch('/api/logs', {
        method: 'POST',
        body: JSON.stringify(data)
    });
}