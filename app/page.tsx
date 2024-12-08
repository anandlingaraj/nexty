//app/page.tsx
import { redirect } from 'next/navigation';
import { getServerSession } from "next-auth/next";
import * as crypto from "crypto";
export default async function Page() {
    redirect('/chat');
}