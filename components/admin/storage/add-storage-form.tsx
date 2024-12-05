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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { StorageProvider, providerFields } from "@/app/admin/storage/types";
import { useState } from "react";

const formSchema = z.object({
    name: z.string().min(2),
    type: z.enum(['S3', 'AZURE_BLOB', 'GCP_STORAGE']),
    credentials: z.record(z.string()),
});

interface AddStorageFormProps {
    onSubmit: (provider: StorageProvider) => void;
}

export function AddStorageForm({ onSubmit }: AddStorageFormProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
    });

    const [selectedType, setSelectedType] = useState<
        'S3' | 'AZURE_BLOB' | 'GCP_STORAGE' | null
    >(null);

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        // Here you would typically validate the credentials before saving
        const provider: StorageProvider = {
            ...values,
            id: '',
            isActive: true,
            status: 'unchecked',
            createdAt: new Date(),
        };

        onSubmit(provider);
        form.reset();
    };

    // @ts-ignore
    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Storage Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Production S3" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Storage Type</FormLabel>
                            <Select
                                onValueChange={(value: 'S3' | 'AZURE_BLOB' | 'GCP_STORAGE') => {
                                    field.onChange(value);
                                    setSelectedType(value);
                                }}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select storage type" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="S3">Amazon S3</SelectItem>
                                    <SelectItem value="AZURE_BLOB">Azure Blob Storage</SelectItem>
                                    <SelectItem value="GCP_STORAGE">Google Cloud Storage</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                {selectedType && (
                    <div className="space-y-4">
                        {providerFields[selectedType].map((field) => (
                            <FormField
                                key={field.key}
                                control={form.control}
                                name={`credentials.${field.key}`}
                                render={({ field: formField }) => (
                                    <FormItem>
                                        <FormLabel>{field.label}</FormLabel>
                                        <FormControl>
                                            {field.type === 'textarea' ? (
                                                <Textarea {...formField} />
                                            ) : (
                                                <Input type={field.type} {...formField} />
                                            )}
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        ))}
                    </div>
                )}

                <Button type="submit" className="w-full">
                    Add Storage Source
                </Button>
            </form>
        </Form>
    );
}