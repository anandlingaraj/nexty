import { DefaultSession } from "next-auth";

declare module "next-auth" {
    export interface Session {
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
}

declare module "next-auth/jwt" {
    export interface JWT {
        provider?: string;
        accessToken?: string;
        idToken?: string;
    }
}