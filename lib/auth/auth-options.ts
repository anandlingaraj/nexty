// app/lib/auth.ts

import { jwtDecode } from "jwt-decode";
import { DefaultSession } from "next-auth";
import AzureADB2C from "next-auth/providers/azure-ad-b2c"
import CredentialsProvider from "next-auth/providers/credentials"
import { createLog } from "../logger";
import { prisma } from "../prisma";

const B2C_TENANT = process.env.AZURE_AD_B2C_TENANT!;
const CLIENT_ID = process.env.AZURE_AD_B2C_CLIENT_ID!;
const POLICY_NAME = process.env.AZURE_AD_B2C_POLICY_NAME!;

declare module "next-auth" {
    interface Session {
        accessToken?: string;
        idToken?: string;
        user: {
            id: string;
            name?: string | null;
            email?: string | null;
            image?: string | null;
            roles?: string[];
        } & DefaultSession["user"];
    }

    interface User {
        accessToken?: string;
        idToken?: string;
        roles?: string[];
    }
}
export const authOptions = {
    providers: [
        CredentialsProvider({
            id: "azure-ad-b2c-ropc",
            name: "Credentials",
            credentials: {
                email: { label: "Email", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                try {
                    console.log("Starting ROPC authorization...");
                    const tokenEndpoint = `https://${B2C_TENANT}.b2clogin.com/${B2C_TENANT}.onmicrosoft.com/${POLICY_NAME}/oauth2/v2.0/token`;
                    console.log("Token endpoint:", tokenEndpoint);

                    const bodyParams = {
                        grant_type: 'password',
                        client_id: CLIENT_ID,
                        scope: `${CLIENT_ID} offline_access openid`,
                        username: credentials?.email || '',
                        password: credentials?.password || '',
                        response_type: 'token id_token',
                    };
                    console.log("Request body params:", bodyParams);


                    const response = await fetch(tokenEndpoint, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/x-www-form-urlencoded',
                        },
                        body: new URLSearchParams(bodyParams).toString(),
                    });

                    // Log the raw response for debugging
                    const responseText = await response.text();
                    console.log('Raw response:', responseText);
                    console.log("Raw response headers:", Object.fromEntries(response.headers.entries()));
                    console.log("Raw response body:", responseText);

                    let data;
                    try {
                        data = JSON.parse(responseText);
                    } catch (e) {
                        console.error('Failed to parse response:', e);
                        throw new Error(`Authentication failed: ${responseText}`);
                    }

                    if (!response.ok) {
                        console.error('Auth error:', data);
                        throw new Error(data.error_description || 'Authentication failed');
                    }
                    const decodedIDToken = jwtDecode(data.id_token) as any;
                    const decodedAccessToken = jwtDecode(data.access_token) as any;
                
                    return {
                        id: decodedIDToken.oid || decodedAccessToken.oid,
                        email: credentials?.email,
                        name: decodedIDToken.name,
                        accessToken: data.access_token,
                        firstName: decodedIDToken.given_name,
                        lastName: decodedIDToken.family_name,
                        idToken: data.id_token,
                        roles: decodedIDToken.roles || [],
                    };
                } catch (error) {
                    console.error('ROPC authentication error:', error);
                    return null;
                }
            }
        }),
        AzureADB2C({
            clientId: process.env.AZURE_AD_B2C_CLIENT_ID!,
            clientSecret: process.env.AZURE_AD_B2C_CLIENT_SECRET!,
            tenantId: process.env.AZURE_AD_B2C_TENANT!,
        })
    ],
    callbacks: {
        async jwt({ token, user, profile }) {
            if (user) {
                token.accessToken = user.accessToken;
                token.idToken = user.idToken;
                token.roles = user.roles;
                token.name = user.name;
                token.id = user.id;
                console.log('Token ID:>>>>>>>>>>>>>>>>>>>', token.id);
                try {
                    const dbUser = await prisma.user.upsert({
                        where: { id: user.id },
                        update: {
                            email: user.email || "",
                            name: user.name || ""
                        },
                        create: {
                            id: user.id,
                            email: user.email || "",
                            name: user.name || ""
                        }
                    });

                    // Then create log
                    await createLog({
                        level: 'info',
                        action: 'USER_LOGIN',
                        details: 'User logged in successfully',
                        userId: dbUser.id,
                        resource: 'auth',
                        metadata: { email: user.email || "" }
                    });

                } catch (error) {
                    console.error('Error creating user/log:', error);
                }
            }
            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            session.idToken = token.idToken;
            session.user.roles = token.roles as string[]
            if (session.user && token.id) {
                session.user.id = token.id as string;
            }
            console.log('session user ID:', session.user.id);
            return session;
        }
    },
    events: {
        async signOut({session, token}) {
            session.accessToken = "";
            session.idToken = "";
            session.user.roles = "";
            return session;
        },
    }
}
