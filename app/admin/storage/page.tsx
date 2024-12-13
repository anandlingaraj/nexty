'use client';

import {useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StorageTable } from "@/components/admin/storage/storage-table";
import { AddStorageForm } from "@/components/admin/storage/add-storage-form";
import { StorageProvider } from "./types"
import {SessionProvider} from '@/components/providers/SessionProvider'
import { fetchStorageAction } from './actions';

export default function StorageConfigPage() {
    const [providers, setProviders] = useState<StorageProvider[]>([]);
    useEffect(() => {
        (async ()=>{
            await fetchStorageAction().then(res=>setProviders(res))
        })()
    }, []);
    const addProvider = (provider: StorageProvider) => {
        setProviders([...providers, { ...provider, id: Date.now().toString() }]);
    };

    const onUpdate=()=>{}

    return (
        <div className="container mx-auto py-8">
            <h1 className="mb-8 text-3xl font-bold">Storage Configuration</h1>

            <Tabs defaultValue="list">
                <TabsList>
                    <TabsTrigger value="list">Storage Sources</TabsTrigger>
                    <TabsTrigger value="add">Add New Source</TabsTrigger>
                </TabsList>

                <TabsContent value="list">
                    <Card>
                        <CardHeader>
                            <CardTitle>Configured Storage Sources</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <StorageTable providers={providers} onUpdate={onUpdate}/>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="add">
                    <SessionProvider>
                    <Card>
                        <CardHeader>
                            <CardTitle>Add Storage Source</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <AddStorageForm onSubmit={addProvider} />
                        </CardContent>
                    </Card>
                    </SessionProvider>
                </TabsContent>
            </Tabs>
        </div>
    );
}