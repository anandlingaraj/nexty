// app/api/auth/change-password/route.ts
import { getServerSession } from "next-auth/next";

import { Client } from "@microsoft/microsoft-graph-client";
import { getToken } from "next-auth/jwt";
import { authOptions } from "@/lib/auth/auth-options";

export async function POST(req: Request) {
    try {

        const session = await getServerSession(authOptions);

        if (!session) {
            return new Response('Unauthorized', { status: 401 });
        }


        const { newPassword } = await req.json();


        if (!newPassword || typeof newPassword !== 'string') {
            return new Response('Invalid password', { status: 400 });
        }


        const token = await getToken({ req });

        if (!token?.accessToken) {
            return new Response('No access token found', { status: 401 });
        }

        // Initialize Microsoft Graph client
        const client = Client.init({
            authProvider: (done) => {
                done(null, token.accessToken as string);
            },
        });


        await client
            .api(`/users/${session.user.email}`)
            .update({
                passwordProfile: {
                    password: newPassword,
                    forceChangePasswordNextSignIn: false,
                },
            });

        return new Response('Password updated successfully', { status: 200 });
    } catch (error) {
        console.error('Password change error:', error);
        return new Response('Failed to update password', { status: 500 });
    }
}