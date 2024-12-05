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


interface StorageTableProps {
    providers: StorageProvider[];
}

export function StorageTable({ providers }: StorageTableProps) {
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

    return (
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
                            {new Date(provider.createdAt).toLocaleDateString()}
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
                                    <DropdownMenuItem>Test Connection</DropdownMenuItem>
                                    <DropdownMenuItem>Edit Configuration</DropdownMenuItem>
                                    <DropdownMenuItem className="text-red-600">
                                        Remove Source
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}