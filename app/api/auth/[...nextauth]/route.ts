// import NextAuth, { Session } from "next-auth";
// import { JWT } from "next-auth/jwt";
// import AzureADB2C from "next-auth/providers/azure-ad-b2c";
// export const authOptions  = {
//     providers: [
//         AzureADB2C({
//             clientId: process.env.AZURE_AD_CLIENT_ID!,
//             clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
//             tenantId: process.env.AZURE_AD_TENANT_ID!,
//             primaryUserFlow: process.env.AZURE_AD_B2C_PRIMARY_USER_FLOW,
//             authorization: {
//                 params: {
//                     scope: "openid offline_access",
//                     response_type: "code",
//                 }
//             },
//             checks: ["pkce"],
//             client: {
//                 token_endpoint_auth_method: "client_secret_post",
//                 id_token_signed_response_alg: "RS256"
//             },
//             profile(profile) {
//                 return {
//                     id: profile.sub,
//                     name: profile.name,
//                     email: profile.emails?.[0] ?? profile.email,
//                 }
//             }
//         }),
//     ],
//     session: {
//         strategy: "jwt",
//         maxAge: 24 * 60 * 60,
//     },
//     pages: {
//         signIn: '/login',
//         signOut: '/auth/signout',
//         error: '/auth/error',
//     },
//     secret: process.env.NEXTAUTH_SECRET as string,
//     callbacks: {
//         async jwt({ token, account}): Promise<JWT> {
//             if (account) {
//                 token.idToken = account.id_token as string;
//                 token.accessToken = account.access_token as string;
//                 token.provider = account.provider;
//             }
//             return token;
//         },
//         async session({ session, token }): Promise<Session> {
//             if (!session || !token) {
//                 return session;
//             }
//
//             const customSession: Session = {
//                 ...session,
//                 accessToken: token.accessToken as string,
//                 idToken: token.idToken as string,
//             };
//
//             return customSession;
//         },
//         async redirect({ url, baseUrl }) : Promise<string>{
//             if (url.startsWith(baseUrl)) return url;
//             else if (url.startsWith("/")) return `${baseUrl}${url}`;
//             return baseUrl;
//         }
//     },
// };
//
// const handler = NextAuth(authOptions);
// export { handler as GET, handler as POST };