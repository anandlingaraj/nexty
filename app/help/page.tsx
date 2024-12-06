// app/help/page.tsx
"use client";

import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, BookOpen, MessageSquare, Phone, Zap, Users, Code, Wrench, Smartphone, Shield } from "lucide-react";
import Link from "next/link";

interface HelpCategory {
    icon: React.ReactNode;
    title: string;
    articlesCount: number;
    link: string;
    isHighlighted?: boolean;
}

const categories: HelpCategory[] = [
    {
        icon: <BookOpen className="h-6 w-6" />,
        title: "About Reveal",
        articlesCount: 4,
        link: "/help/about",
    },
    {
        icon: <MessageSquare className="h-6 w-6" />,
        title: "Reveal",
        articlesCount: 41,
        link: "/help/Reveal-ai",
    },
    {
        icon: <Phone className="h-6 w-6" />,
        title: "Reveal Phone Verification",
        articlesCount: 7,
        link: "/help/phone-verification",
    },
    {
        icon: <Zap className="h-6 w-6" />,
        title: "RevealPro Plan",
        articlesCount: 17,
        link: "/help/pro-plan",
        isHighlighted: true,
    },
    {
        icon: <Users className="h-6 w-6" />,
        title: "Reveal for Work (Team & Enterprise)",
        articlesCount: 34,
        link: "/help/enterprise",
    },
    {
        icon: <Code className="h-6 w-6" />,
        title: "Reveal API & API Console",
        articlesCount: 26,
        link: "/help/api",
    },
    {
        icon: <Wrench className="h-6 w-6" />,
        title: "API Prompt Design",
        articlesCount: 4,
        link: "/help/prompt-design",
    },
    {
        icon: <Smartphone className="h-6 w-6" />,
        title: "Reveal Mobile Apps",
        articlesCount: 13,
        link: "/help/mobile",
    },
    {
        icon: <Shield className="h-6 w-6" />,
        title: "Privacy & Legal",
        articlesCount: 13,
        link: "/help/privacy",
    },
];

export default function HelpPage() {
    return (
        <div className="container mx-auto max-w-6xl py-12">
            <h1 className="mb-12 text-center text-4xl font-semibold">
                Discover answers and insights from the team
            </h1>

            {/* Search Bar */}
            <div className="mb-12 flex items-center gap-2 rounded-lg border bg-background px-4 py-2">
                <Search className="h-5 w-5 text-muted-foreground" />
                <Input
                    type="text"
                    placeholder="Search for articles..."
                    className="border-0 bg-transparent focus-visible:ring-0"
                />
            </div>

            {/* Categories Grid */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {categories.map((category) => (
                    <Link href={category.link} key={category.title}>
                        <Card
                            className={`transition-all hover:shadow-md ${
                                category.isHighlighted ? 'border-blue-500' : ''
                            }`}
                        >
                            <CardContent className="flex items-start gap-4 p-6">
                                <div className="rounded-lg bg-muted p-2">
                                    {category.icon}
                                </div>
                                <div>
                                    <h2 className="font-semibold">{category.title}</h2>
                                    <p className="text-sm text-muted-foreground">
                                        {category.articlesCount} articles
                                    </p>
                                </div>
                            </CardContent>
                        </Card>
                    </Link>
                ))}
            </div>
        </div>
    );
}