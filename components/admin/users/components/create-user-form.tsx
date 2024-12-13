// app/admin/users/components/create-user-form.tsx
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { User } from "@/app/admin/users/types";
import { createLog } from "@/lib/logger";
import { useSession } from "next-auth/react";
import { CustomSession } from "@/app/chat/page";

const formSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    role: z.string(),
    status: z.enum(['active', 'inactive']),
});

interface CreateUserFormProps {
    onSubmit: (user: User) => void;
}

export function CreateUserForm({ onSubmit }: CreateUserFormProps) {
    const { data: session, status } = useSession() as {
        data: CustomSession | null;
        status: "loading" | "authenticated" | "unauthenticated"
    };
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            email: '',
            role: 'user',
            status: 'active'
        },
    });

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            onSubmit({
                ...values,
                id: '',
                createdAt: new Date(),
            });
            await createLog({
                level: 'info',
                action: 'USER_CREATE',
                details: `User created successfully: ${values.email}`,
                userId: session!.user.id,
                resource: 'user',
                metadata: {
                    createdUser: values.email,
                    role: values.role,
                    status: values.status
                }
            });

            form.reset();
        }catch (error){
            await createLog({
                level: 'error',
                action: 'USER_CREATE_FAILED',
                details: `Failed to create user: ${values.email}`,
                userId: session!.user.id,
                resource: 'user',
                metadata: { error: error.message }
            });
        }
    };

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Role</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a role" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="user">User</SelectItem>
                                    <SelectItem value="editor">Editor</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="active">Active</SelectItem>
                                    <SelectItem value="inactive">Inactive</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <Button type="submit" className="w-full">Create User</Button>
            </form>
        </Form>
    );
}
