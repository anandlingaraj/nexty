import NextAuth from "next-auth";
import { OAuthConfig } from "next-auth/providers";

export const authOptions = {
    providers: [
        {
            id: "oidc",
            name: "OIDC Provider",
            type: "oauth",
            wellKnown: process.env.OIDC_WELLKNOWN_URL,
            clientId: process.env.OIDC_CLIENT_ID,
            clientSecret: process.env.OIDC_CLIENT_SECRET,
            authorization: { params: { scope: "openid email profile" } },
            idToken: true,
            checks: ["pkce", "state"],
            profile(profile) {
                return {
                    id: profile.sub,
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                };
            },
        } as OAuthConfig<any>,
    ],
    callbacks: {
        async jwt({ token, account }) {
            if (account) {
                token.accessToken = account.access_token;
            }
            return token;
        },
        async session({ session, token }) {
            session.accessToken = token.accessToken;
            return session;
        },
        async redirect({ url, baseUrl }) {
            console.log('Redirect callback:', { url, baseUrl });
            return url.startsWith(baseUrl) ? url : baseUrl;
        },
    },
};

export const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };