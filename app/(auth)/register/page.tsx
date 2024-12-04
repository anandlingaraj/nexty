// app/(auth)/register/page.tsx
'use client';

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { useToast } from "@/hooks/use-toast";
import type { NextPage } from 'next'
import {useRouter} from "next/navigation";
const Page: NextPage = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });
    const { toast } = useToast();
    const router = useRouter();

    const handleLoginClick=()=>{
        console.log('Login clicked');
        router.push('/login');
    }
    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault();
        setIsLoading(true);

        if (formData.password !== formData.confirmPassword) {
            toast({
                title: "Error",
                description: "Passwords do not match.",
                variant: "destructive",
            });
            setIsLoading(false);
            return;
        }


        try {
            // Add your registration logic here
            // After successful registration, you might want to sign in the user
            const result = await signIn("credentials", {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (result?.error) {
                toast({
                    title: "Error",
                    description: "There was an error creating your account. Please try again.",
                    variant: "destructive",
                });
            } else {
                window.location.href = "/chat";
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "There was an error creating your account. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-4">
            <div className="relative w-full max-w-md space-y-8">
                <div className="absolute inset-0 -z-10 bg-white/50 shadow-xl shadow-indigo-500/10 rounded-2xl blur-2xl" />

                <Card className="border-0 shadow-lg bg-white/80 backdrop-blur-xl">
                    <CardHeader className="space-y-1">
                        <div className="flex items-center justify-center mb-4">
                            <Icons.logo className="h-12 w-12 text-indigo-600" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-center text-gray-900">
                            Create an account
                        </CardTitle>
                        <CardDescription className="text-center text-gray-600">
                            Enter your email below to create your account
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-6">
                            <Button
                                variant="outline"
                                type="button"
                                disabled={isLoading}
                                onClick={() => signIn('oidc', { callbackUrl: '/chat' })}
                                className="gap-2"
                            >
                                {isLoading ? (
                                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                    <Icons.google className="mr-2 h-4 w-4" />
                                )}
                                Continue with OIDC
                            </Button>

                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t" />
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-white px-2 text-gray-500">
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            <form onSubmit={onSubmit} className="space-y-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        placeholder="name@example.com"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        autoCapitalize="none"
                                        autoComplete="email"
                                        autoCorrect="off"
                                        disabled={isLoading}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        autoCapitalize="none"
                                        autoComplete="new-password"
                                        disabled={isLoading}
                                        required
                                    />
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        autoCapitalize="none"
                                        autoComplete="new-password"
                                        disabled={isLoading}
                                        required
                                    />
                                </div>
                                <Button
                                    type="submit"
                                    disabled={isLoading}
                                    className="w-full"
                                >
                                    {isLoading && (
                                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
                                    )}
                                    Create Account
                                </Button>
                            </form>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <div className="text-sm text-gray-500 text-center">
                            Already have an account?{" "}
                            <button
                                onClick={handleLoginClick}
                                className="text-indigo-600 hover:text-indigo-500 font-medium"
                            >
                                Sign up
                            </button>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
export default Page;