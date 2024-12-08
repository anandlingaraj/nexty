// app/admin/profile/page.tsx
'use client';

import {SessionProvider,  } from "next-auth/react"
import { ProfileContent } from "@/components/profile/ProfileContent";


export default function Page() {
    return <>
    <SessionProvider>
           

            <ProfileContent/>

    </SessionProvider>
    </>
}