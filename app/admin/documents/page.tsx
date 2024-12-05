// app/admin/documents/page.tsx
'use client';

import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format } from "date-fns";
import {
    Search,
    Filter,
    Download,
    FileText,
    Trash2,
    Eye,
    Edit,
    Upload,
    FileUp,
    ChevronRight,
} from "lucide-react";

interface Document {
    id: string;
    name: string;
    type: 'pdf' | 'doc' | 'image' | 'other';
    size: number;
    status: 'active' | 'archived' | 'deleted';
    createdAt: Date;
    updatedAt: Date;
    owner: string;
    location: string;
    tags: string[];
    metadata: Record<string, any>;
}

export default function DocumentsPage() {
    const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
    const [filters, setFilters] = useState({
        type: '',
        status: '',
        owner: '',
    });

    // Sample document data
    const documents: Document[] = [
        {
            id: '1',
            name: 'Annual Report 2024.pdf',
            type: 'pdf',
            size: 1024 * 1024 * 2.5, // 2.5MB
            status: 'active',
            createdAt: new Date(),
            updatedAt: new Date(),
            owner: 'john.doe@example.com',
            location: 'reports/annual',
            tags: ['financial', 'report', '2024'],
            metadata: {
                pages: 45,
                version: '1.0',
                lastModifiedBy: 'Jane Smith',
            },
        },
        // Add more sample documents
    ];

    const getStatusBadge = (status: Document['status']) => {
        const variants = {
            active: 'default',
            archived: 'secondary',
            deleted: 'destructive',
        } as const;

        return <Badge variant={variants[status]}>{status}</Badge>;
    };

    const formatFileSize = (bytes: number) => {
        const units = ['B', 'KB', 'MB', 'GB'];
        let size = bytes;
        let unitIndex = 0;

        while (size >= 1024 && unitIndex < units.length - 1) {
            size /= 1024;
            unitIndex++;
        }

        return `${size.toFixed(1)} ${units[unitIndex]}`;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold">Documents</h1>
                    <p className="text-muted-foreground">Manage and organize your documents</p>
                </div>
                <div className="flex gap-2">
                    <Button>
                        <Upload className="mr-2 h-4 w-4" />
                        Upload
                    </Button>
                </div>
            </div>

            {/* Filters */}
            <Card>
                <CardContent className="pt-6">
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Search documents..."
                                className="flex-1"
                                onChange={(e) => {/* implement search */}}
                            />
                        </div>

                        <Select onValueChange={(value) => setFilters({ ...filters, type: value })}>
                            <SelectTrigger>
                                <SelectValue placeholder="File type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="pdf">PDF</SelectItem>
                                <SelectItem value="doc">Document</SelectItem>
                                <SelectItem value="image">Image</SelectItem>
                                <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                        </Select>

                        <Select onValueChange={(value) => setFilters({ ...filters, status: value })}>
                            <SelectTrigger>
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="active">Active</SelectItem>
                                <SelectItem value="archived">Archived</SelectItem>
                                <SelectItem value="deleted">Deleted</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

            {/* Documents Table */}
            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Size</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Owner</TableHead>
                                <TableHead>Last Modified</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {documents.map((doc) => (
                                <TableRow
                                    key={doc.id}
                                    className="cursor-pointer hover:bg-muted/50"
                                >
                                    <TableCell className="font-medium">{doc.name}</TableCell>
                                    <TableCell>{doc.type.toUpperCase()}</TableCell>
                                    <TableCell>{formatFileSize(doc.size)}</TableCell>
                                    <TableCell>{getStatusBadge(doc.status)}</TableCell>
                                    <TableCell>{doc.owner}</TableCell>
                                    <TableCell>{format(doc.updatedAt, 'PPpp')}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => setSelectedDoc(doc)}
                                            >
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon">
                                                <Download className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Document Detail Drawer */}
            <Drawer open={!!selectedDoc} onOpenChange={() => setSelectedDoc(null)}>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>{selectedDoc?.name}</DrawerTitle>
                        <DrawerDescription>
                            Last modified {selectedDoc?.updatedAt.toLocaleString()}
                        </DrawerDescription>
                    </DrawerHeader>
                    <ScrollArea className="h-[60vh] p-6">
                        {selectedDoc && (
                            <div className="space-y-6">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div>
                                        <h4 className="mb-2 text-sm font-medium">File Information</h4>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Type:</span>
                                                <span>{selectedDoc.type.toUpperCase()}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Size:</span>
                                                <span>{formatFileSize(selectedDoc.size)}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Location:</span>
                                                <span>{selectedDoc.location}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-muted-foreground">Status:</span>
                                                <span>{getStatusBadge(selectedDoc.status)}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="mb-2 text-sm font-medium">Tags</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {selectedDoc.tags.map(tag => (
                                                <Badge key={tag} variant="secondary">{tag}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="mb-2 text-sm font-medium">Metadata</h4>
                                    <Card>
                                        <CardContent className="p-4">
                                            <pre className="whitespace-pre-wrap text-sm">
                                                {JSON.stringify(selectedDoc.metadata, null, 2)}
                                            </pre>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        )}
                    </ScrollArea>
                    <DrawerFooter className="flex-row justify-between">
                        <Button variant="destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </Button>
                        <DrawerClose asChild>
                            <Button variant="outline">Close</Button>
                        </DrawerClose>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        </div>
    );
}