// app/(auth)/login/page.tsx
'use client';

import React, { useState } from "react";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Icons } from "@/components/ui/icons";
import { useToast } from "@/hooks/use-toast";
import { useRouter, useSearchParams } from 'next/navigation';
import type { NextPage } from 'next'

const Page: NextPage = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const { toast } = useToast();
    const router = useRouter();
    const searchParams = useSearchParams();
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

    const handleRegisterClick = () => {
        console.log('Register clicked');
        router.push('/register');
    };
    const handleOIDCLogin = async () => {
        try {
            console.log('Attempting OIDC login...');
            const result = await signIn('azure-ad-b2c', {
                callbackUrl: callbackUrl,
                redirect: true
            });
            console.log('SignIn result:', result);
        } catch (error) {
            console.error('SignIn error:', error);
            toast({
                title: "Error",
                description: "Authentication failed. Please try again.",
                variant: "destructive",
            });
        }
    };


    async function onSubmit(event: React.SyntheticEvent) {
        event.preventDefault();
        setIsLoading(true);

        try {

            const result = await signIn("azure-ad-b2c-ropc", {
                email: formData.email,
                password: formData.password,
                redirect: false,
            });

            if (result?.error) {
                toast({
                    title: "Error",
                    description: "Invalid email or password. Please try again.",
                    variant: "destructive",
                });
            } else {
                window.location.href = "/chat";
            }
        } catch (error) {
            toast({
                title: "Error",
                description: "There was an error logging in. Please try again.",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-background p-4">
            <div className="relative w-full max-w-md space-y-8">
                <div className="absolute inset-0 -z-10 bg-card/50 shadow-xl shadow-primary/10 rounded-2xl blur-2xl"/>


                <Card className="border-0 shadow-lg bg-card/80 backdrop-blur-xl">
                    <CardHeader className="space-y-1">
                        <div className="flex items-center justify-center mb-4">
                            <Icons.logo className="h-12 w-12 text-primary" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-center">
                            Welcome back
                        </CardTitle>
                        <CardDescription className="text-center">
                            Sign in to your account to continue
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-4">
                        <div className="grid gap-6">
                            <Button
                                variant="outline"
                                type="button"
                                disabled={isLoading}
                                onClick={handleOIDCLogin}
                                className="gap-2"
                            >
                                {isLoading ? (
                                    <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                                ) : (
                                    <Icons.google className="mr-2 h-4 w-4"/>
                                )}
                                Continue with OIDC
                            </Button>


                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <span className="w-full border-t"/>
                                </div>
                                <div className="relative flex justify-center text-xs uppercase">
                                    <span className="bg-background px-2 text-muted-foreground">
                                        Or continue with
                                    </span>
                                </div>
                            </div>
                            <form onSubmit={onSubmit} className="space-y-4">
                                {/* Form fields remain the same but use theme-aware styling */}
                                <div className="grid gap-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        placeholder="name@example.com"
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        autoCapitalize="none"
                                        autoComplete="current-password"
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
                                        <Icons.spinner className="mr-2 h-4 w-4 animate-spin"/>
                                    )}
                                    Sign In
                                </Button>
                            </form>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <div className="text-sm text-muted-foreground text-center">
                            Don't have an account?{" "}
                            <Button
                                variant="ghost"
                                onClick={handleRegisterClick}
                                className="text-primary hover:text-primary/90 font-medium"
                            >
                                Sign up
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}

export default Page;