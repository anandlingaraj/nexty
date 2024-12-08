'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from "@/lib/utils";
import { TopMenuBar } from '@/components/layout/top-menubar';
import { SessionProvider } from 'next-auth/react';
import {UserRound, MessageSquareMore, SlidersHorizontal} from 'lucide-react';
export default function ProfileLayout({
                                           children,
                                       }: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

    const navigation = [
        { name: 'Profile', href: '/settings/profile', icon: UserRound },

        { name: 'Account', href: '/settings/account', icon: SlidersHorizontal },

        { name: 'Chat', href: '/chat', icon: MessageSquareMore },
    ];

    return (<SessionProvider >
        <TopMenuBar />
        <div className="flex min-h-screen bg-gray-50/50">
            <div className="w-64 p-8">

                <nav className="space-y-1">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href;
                        const Icon = item.icon;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-gray-200/80 text-gray-900'
                                        : 'text-gray-600 hover:bg-gray-200/50 hover:text-gray-900'
                                )}
                            >
                                <Icon className="h-4 w-4" />
                                <span>{item.name}</span>
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
