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
import {useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "@/hooks/use-toast";
import { Loader2, RefreshCw } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";


const formSchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    type: z.enum(['S3', 'AZURE_BLOB', 'GCP_STORAGE']),
    credentials: z.record(z.string()).refine((data) => {
        return Object.keys(data).length > 0;
    }, "Credentials are required"),
    bucketMode: z.enum(['create', 'select']),
    selectedBucket: z.union([z.string(), z.undefined()])
      }).superRefine((data, ctx) => {
    if (data.bucketMode === 'select' && !data.selectedBucket) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select a bucket",
            path: ['selectedBucket']
        });
    }
});

interface AddStorageFormProps {
    onSubmit: (provider: StorageProvider) => void;
}

interface Bucket {
    name: string;
    region?: string;
}

export function AddStorageForm({ onSubmit }: AddStorageFormProps) {
    const session = useSession();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoadingBuckets, setIsLoadingBuckets] = useState(false);
    const [availableBuckets, setAvailableBuckets] = useState<Bucket[]>([]);
    const [bucketMode, setBucketMode] = useState<'create' | 'select'>('create');

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            credentials: {},
            bucketMode: 'create',
            selectedBucket: '',
        },
    });

    const [selectedType, setSelectedType] = useState<
        'S3' | 'AZURE_BLOB' | 'GCP_STORAGE' | null
    >(null);

    const listBuckets = async (credentials: Record<string, string>, type: string) => {
        setIsLoadingBuckets(true);
        try {
            const response = await fetch('/api/connections/buckets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type,
                    credentials,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to fetch buckets');
            }

            const data = await response.json();
            setAvailableBuckets(data.buckets);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to fetch buckets. Please check your credentials.",
                variant: "destructive",
            });
            setAvailableBuckets([]);
        } finally {
            setIsLoadingBuckets(false);
        }
    };

    // Filter out bucket/container field from provider fields
    const getCredentialFields = (type: string) => {
        return providerFields[type as keyof typeof providerFields].filter(
            field => !['bucket', 'containerName'].includes(field.key)
        );
    };

    const handleSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            setIsSubmitting(true);

            if (!selectedType) {
                throw new Error('Please select a storage type');
            }

            let finalCredentials = { ...values.credentials };
            const bucketKey = selectedType === 'AZURE_BLOB' ? 'containerName' : 'bucket';

            if (bucketMode === 'select') {
                if (!values.selectedBucket) {
                    throw new Error('Please select a bucket');
                }
                finalCredentials[bucketKey] = values.selectedBucket;
            } else if (!finalCredentials[bucketKey]) {
                throw new Error(`${bucketKey} is required`);
            }

            // Single type check for required fields
            const requiredFields = providerFields[selectedType];
            const missingFields = requiredFields.filter(
                field => !finalCredentials[field.key]
            );

            if (missingFields.length > 0) {
                throw new Error(`Missing required fields: ${missingFields.map(f => f.label).join(', ')}`);
            }

            const connectionData = {
                user_id: session.data?.user.id,
                name: values.name,
                type: values.type,
                credentials: finalCredentials,
            };

            const response = await fetch('/api/connections', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(connectionData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create connection');
            }

            const newConnection = await response.json();
            onSubmit({
                ...newConnection,
                credentials: finalCredentials,
                user_id: session.data!.user.id,
                isActive: true,
                status: 'unchecked',
                createdAt: new Date(),
            } as StorageProvider);

            toast({
                title: "Success",
                description: "Storage connection created successfully",
            });

            form.reset();
            setSelectedType(null);
            setAvailableBuckets([]);
            setBucketMode('create');
        } catch (error) {
            console.error('Error creating connection:', error);
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to create connection",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };
    const watchType = form.watch('type');

    useEffect(() => {
        if (watchType !== selectedType) {
            setSelectedType(watchType);
            form.setValue('credentials', {});
            form.setValue('selectedBucket', '');
            setBucketMode('create');
            setAvailableBuckets([]);
        }
    }, [watchType, selectedType, form]);

    const onSubmitForm = form.handleSubmit(async (data) => {
        console.log("Form Submit Triggered with data:", data);
        console.log("Current bucket mode:", bucketMode);
        console.log("Selected bucket:", data.selectedBucket);
        console.log("Credentials:", data.credentials);
        await handleSubmit(data);
    });

    return (
        <Form {...form}>
            <form onSubmit={onSubmitForm} className="space-y-6">
                <FormField
                    control={form.control}
                    name="name"
                    render={({field}) => (
                        <FormItem>
                            <FormLabel>Storage Name</FormLabel>
                            <FormControl>
                                <Input placeholder="Production S3" {...field} />
                            </FormControl>
                            <FormMessage/>
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
                                value={field.value}
                                onValueChange={field.onChange}

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
                    <>
                        {/* Credential fields without bucket/container */}
                        <div className="space-y-4">
                            {getCredentialFields(selectedType).map((field) => (
                                <FormField
                                    key={field.key}
                                    control={form.control}
                                    name={`credentials.${field.key}`}
                                    render={({field: formField}) => (
                                        <FormItem>
                                            <FormLabel>{field.label}</FormLabel>
                                            <FormControl>
                                                {field.type === 'textarea' ? (
                                                    <Textarea {...formField} />
                                                ) : (
                                                    <Input type={field.type} {...formField} />
                                                )}
                                            </FormControl>
                                            <FormMessage/>
                                        </FormItem>
                                    )}
                                />
                            ))}
                        </div>

                        {/* Bucket/Container Selection */}
                        <Card className="p-4">
                            <RadioGroup
                                defaultValue="create"
                                value={bucketMode}
                                onValueChange={(value: 'create' | 'select') => {
                                    setBucketMode(value);
                                    form.setValue('bucketMode', value);
                                    if (value === 'select') {
                                        const bucketKey = selectedType === 'AZURE_BLOB' ? 'containerName' : 'bucket';
                                        form.setValue(`credentials.${bucketKey}`, '');
                                    } else {
                                        form.setValue('selectedBucket', '');
                                    }
                                }}
                                className="mb-4"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="create" id="create"/>
                                    <label htmlFor="create">Create
                                        New {selectedType === 'AZURE_BLOB' ? 'Container' : 'Bucket'}</label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="select" id="select"/>
                                    <label htmlFor="select">Select
                                        Existing {selectedType === 'AZURE_BLOB' ? 'Container' : 'Bucket'}</label>
                                </div>
                            </RadioGroup>

                            <CardContent className="p-0">
                                {bucketMode === 'create' ? (
                                    <FormField
                                        control={form.control}
                                        name={`credentials.${selectedType === 'AZURE_BLOB' ? 'containerName' : 'bucket'}`}
                                        render={({field}) => (
                                            <FormItem>
                                                <FormLabel>
                                                    {selectedType === 'AZURE_BLOB' ? 'Container Name' : 'Bucket Name'}
                                                </FormLabel>
                                                <FormControl>
                                                    <Input {...field} />
                                                </FormControl>
                                                <FormMessage/>
                                            </FormItem>
                                        )}
                                    />
                                ) : (
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <FormLabel>
                                                Select {selectedType === 'AZURE_BLOB' ? 'Container' : 'Bucket'}
                                            </FormLabel>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="sm"
                                                onClick={() => {
                                                    const credentials = form.getValues('credentials');
                                                    if (credentials) {
                                                        listBuckets(credentials, selectedType);
                                                    }
                                                }}
                                                disabled={isLoadingBuckets}
                                            >
                                                {isLoadingBuckets ? (
                                                    <Loader2 className="h-4 w-4 animate-spin"/>
                                                ) : (
                                                    <RefreshCw className="h-4 w-4"/>
                                                )}
                                                <span className="ml-2">Refresh</span>
                                            </Button>
                                        </div>
                                        <FormField
                                            control={form.control}
                                            name="selectedBucket"
                                            render={({field}) => (
                                                <FormItem>
                                                    <Select
                                                        value={field.value || ''}
                                                        onValueChange={field.onChange}
                                                        disabled={isLoadingBuckets || availableBuckets.length === 0}
                                                    >
                                                        <FormControl>
                                                            <SelectTrigger>
                                                                <SelectValue placeholder={
                                                                    isLoadingBuckets
                                                                        ? "Loading..."
                                                                        : availableBuckets.length === 0
                                                                            ? "Click refresh to load buckets"
                                                                            : "Select a bucket"
                                                                }/>
                                                            </SelectTrigger>
                                                        </FormControl>
                                                        <SelectContent>
                                                            {availableBuckets.map((bucket) => (
                                                                <SelectItem key={bucket.name} value={bucket.name}>
                                                                    {bucket.name}
                                                                </SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    <FormMessage/>
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </>
                )}

                <Button
                    type="submit"
                    className="w-full"
                    disabled={isSubmitting || !form.formState.isValid}
                    onClick={() => {
                        console.log("Submit button clicked");
                        console.log("Form errors:", form.formState.errors);
                        console.log("Form values:", form.getValues());
                    }}
                >
                    {isSubmitting ? "Adding Storage..." : "Add Storage Source"}
                </Button>
            </form>
        </Form>
    );
}

