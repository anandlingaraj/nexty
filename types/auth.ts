declare module "next-auth" {
    export interface Session {
        accessToken?: string;
        idToken?: string;
    }
}

declare module "next-auth/jwt" {
    export interface JWT {
        provider?: string;
        accessToken?: string;
        idToken?: string;
    }
}