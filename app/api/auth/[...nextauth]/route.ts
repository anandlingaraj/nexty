// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth/auth-options"


// @ts-ignore
const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }