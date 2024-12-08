// types/next-auth.d.ts
import { DefaultSession } from "next-auth"

declare module "next-auth" {
    interface Session {
        accessToken?: string
        idToken?: string
        user: {
            id: string
            name?: string | null;
            email?: string | null;
            image?: string | null;
        } & DefaultSession["user"]
    }

    interface User {
        accessToken?: string
        idToken?: string
    }
}