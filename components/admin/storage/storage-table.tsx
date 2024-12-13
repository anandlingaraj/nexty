
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Check, X, AlertTriangle } from "lucide-react";
import { StorageProvider } from "@/app/admin/storage/types";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { AddStorageForm } from "./add-storage-form";
import {SessionProvider} from '@/components/providers/SessionProvider'
interface StorageTableProps {
    providers: StorageProvider[];
    onUpdate: () => void;
}

export function StorageTable({ providers, onUpdate }: StorageTableProps) {

    const [testingId, setTestingId] = useState<string | null>(null);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [editingProvider, setEditingProvider] = useState<StorageProvider | null>(null);
    const getStatusIcon = (status: StorageProvider['status']) => {
        switch (status) {
            case 'connected':
                return <Check className="h-4 w-4 text-green-500" />;
            case 'error':
                return <X className="h-4 w-4 text-red-500" />;
            default:
                return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
        }
    };

    const testConnection = async (provider: StorageProvider) => {
        try {
            const response = await fetch('/api/connections/test', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    type: provider.type,
                    credentials: provider.credentials,
                    id: provider.id
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Connection test failed');
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.error || 'Connection test failed');
            }

            toast({
                title: "Connection Test",
                description: result.message || "Connection successful!",
            });

            return result.success;
        } catch (error) {
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to test connection",
                variant: "destructive",
            });
            return false;
        }
    };
    const deleteProvider = async (id: string) => {
        try {
            const response = await fetch('/api/connections', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id }),
            });

            if (!response.ok) {
                throw new Error('Failed to delete connection');
            }

            toast({
                title: "Success",
                description: "Storage connection removed successfully",
            });

            onUpdate();
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to remove connection",
                variant: "destructive",
            });
        } finally {
            setDeletingId(null);
        }
    };

    const handleEdit = async (provider: StorageProvider) => {
        try {
            const response = await fetch('/api/connections', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: provider.id,
                    ...provider,
                }),
            });

            if (!response.ok) {
                throw new Error('Failed to update connection');
            }

            toast({
                title: "Success",
                description: "Storage connection updated successfully",
            });

            onUpdate();
            setEditingProvider(null);
        } catch (error) {
            toast({
                title: "Error",
                description: "Failed to update connection",
                variant: "destructive",
            });
        }
    };

    return (
        <>
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Checked</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead></TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {providers.map((provider) => (
                    <TableRow key={provider.id}>
                        <TableCell className="font-medium">{provider.name}</TableCell>
                        <TableCell>
                            <Badge variant="secondary">
                                {provider.type.replace('_', ' ')}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                {getStatusIcon(provider.status)}
                                {provider.status}
                            </div>
                        </TableCell>
                        <TableCell>
                            {provider.lastChecked
                                ? new Date(provider.lastChecked).toLocaleString()
                                : 'Never'}
                        </TableCell>
                        <TableCell>
                            {provider.createdAt && new Date(provider.createdAt).toLocaleDateString()}
                            {provider.created_at && new Date(provider.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                            <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="sm">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                    <DropdownMenuItem
                                        onClick={() => testConnection(provider)}
                                        disabled={testingId === provider.id}
                                    >
                                        Test Connection
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        onClick={() => setEditingProvider(provider)}
                                    >
                                        Edit Configuration
                                    </DropdownMenuItem>
                                    <DropdownMenuItem
                                        className="text-red-600"
                                        onClick={() => setDeletingId(provider.id)}
                                    >
                                        Remove Source
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    {/* Edit Dialog */}
    <Dialog open={!!editingProvider} onOpenChange={() => setEditingProvider(null)}>
        <DialogContent>
            <DialogHeader>
                <DialogTitle>Edit Storage Configuration</DialogTitle>
            </DialogHeader>
            {editingProvider && (
                <SessionProvider>
                <AddStorageForm
                    onSubmit={(updatedProvider) => handleEdit({
                        ...editingProvider,
                        ...updatedProvider
                    })}
                />
                </SessionProvider>
            )}
        </DialogContent>
    </Dialog>

    {/* Delete Confirmation Dialog */}
    <AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                <AlertDialogDescription>
                    This action cannot be undone. This will permanently remove the
                    storage connection from your account.
                </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                    onClick={() => deletingId && deleteProvider(deletingId)}
                    className="bg-red-600 hover:bg-red-700"
                >
                    Remove
                </AlertDialogAction>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
        </>
    );
}