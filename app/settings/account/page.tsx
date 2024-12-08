// app/admin/profile/page.tsx
'use client';

import {SessionProvider,  } from "next-auth/react"
import  AccountSettings  from "@/components/profile/AccountSettings";


export default function Page() {
    return <>
        <SessionProvider>


            <AccountSettings/>

        </SessionProvider>
    </>
}