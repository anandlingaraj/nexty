'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import { TopMenuBar } from '@/components/layout/top-menubar';
import { SessionProvider } from 'next-auth/react';

export default function ProfileLayout({
                                           children,
                                       }: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const navigation = [
        { name: 'Profile', href: '/settings/profile' },
        // { name: 'Billing', href: '/settings/billing' },
        { name: 'Account', href: '/settings/account' },
    ];

    return (<SessionProvider >
        <TopMenuBar />
        <div className="flex min-h-screen bg-gray-50/50">
            <div className="w-64 p-8">

                <nav className="space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    'block px-4 py-2 rounded-md text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-gray-200/80 text-gray-900'
                                        : 'text-gray-600 hover:bg-gray-200/50 hover:text-gray-900'
                                )}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* Main content */}
            <main className="flex-1 p-8">
                <div className="max-w-4xl bg-transparent rounded-lg shadow-sm">
                    {children}
                </div>
            </main>
        </div>
        </SessionProvider>
    );
}
