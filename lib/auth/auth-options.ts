// app/lib/auth.ts

import { jwtDecode } from "jwt-decode";
import AzureADB2C from "next-auth/providers/azure-ad-b2c"
import CredentialsProvider from "next-auth/providers/credentials"

const B2C_TENANT = process.env.AZURE_AD_B2C_TENANT!;
const CLIENT_ID = process.env.AZURE_AD_B2C_CLIENT_ID!;
const POLICY_NAME = process.env.AZURE_AD_B2C_POLICY_NAME!;
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
                    const decodedToken = jwtDecode(data.id_token) as any;
                    return {
                        id: data.oid || 'unknown',
                        email: credentials?.email,
                        name: decodedToken.name,
                        accessToken: data.access_token,
                        idToken: data.id_token,
                        roles: decodedToken.roles || [],
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
        async jwt({ token, user }) {
            if (user) {
                token.accessToken = user.accessToken;
                token.idToken = user.idToken;
                token.roles = user.roles;
            }
            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            session.idToken = token.idToken;
            session.user.roles = token.roles as string[]
            return session;
        }
    },
    events: {
        async signOut({session, token}) {

        },
    }
}
