// app/api/auth/logout/route.ts
import { authOptions } from "@/lib/auth/auth-options";
import { getServerSession } from "next-auth/next";


export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return new Response('No active session', { status: 401 });
        }


        return new Response('Logged out successfully', { status: 200 });
    } catch (error) {
        console.error('Logout error:', error);
        return new Response('Failed to logout', { status: 500 });
    }
}