// app/admin/users/components/bulk-upload-form.tsx
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { User } from "@/app/admin/users/types";
import { Upload } from 'lucide-react';

interface BulkUploadFormProps {
    onUpload: (users: User[]) => void;
}

export function BulkUploadForm({ onUpload }: BulkUploadFormProps) {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setFile(file);
            setError(null);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file) return;

        try {
            const text = await file.text();
            const rows = text.split('\n').filter(row => row.trim());
            const headers = rows[0].split(',');

            const users: User[] = rows.slice(1).map(row => {
                const values = row.split(',');
                return {
                    id: Date.now().toString(),
                    name: values[0],
                    email: values[1],
                    role: values[2],
                    status: values[3] as 'active' | 'inactive',
                    createdAt: new Date(),
                };
            });

            onUpload(users);
            setFile(null);
            setError(null);
        } catch (err) {
            setError('Error processing file. Please ensure it\'s a valid CSV.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-4">
                <Input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    className="flex-1"
                />
                <Button type="submit" disabled={!file}>
                    <Upload className="mr-2 h-4 w-4" />
                    Upload
                </Button>
            </div>

            {error && (
                <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            )}

            <div className="rounded-lg border p-4">
                <h3 className="mb-2 font-semibold">CSV Format</h3>
                <p className="text-sm text-muted-foreground">
                    Your CSV file should have the following columns:
                </p>
                <code className="mt-2 block text-sm">
                    name,email,role,status
                </code>
                <p className="mt-2 text-sm text-muted-foreground">
                    Example:
                    <br />
                    John Doe,john@example.com,user,active
                </p>
            </div>
        </form>
    );
}