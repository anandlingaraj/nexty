'use server';
import { StorageProvider } from './types';
//import { createLog } from "@/lib/logger";

export async function deleteStorageAction(id: string) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/connections`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
        });

        if (!response.ok) throw new Error('Failed to delete storage source');

        /*await createLog({
            level: 'info',
            action: 'STORAGE_DELETE',
            details: `Storage source deleted successfully`,
            userId: id,
            resource: 'storage',
        });*/

        return await response.json();
    } catch (error) {
        /*await createLog({
            level: 'error',
            action: 'STORAGE_DELETE',
            details: `Failed to delete storage source`,
            userId: id,
            resource: 'storage',
        });*/
        throw new Error('Failed to delete storage source');
    }
}

export async function updateStorageAction(id: string, storageData: Partial<StorageProvider>) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/connections`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, ...storageData }),
        });

        if (!response.ok) throw new Error('Failed to update storage source');

        /*await createLog({
            level: 'info',
            action: 'STORAGE_UPDATE',
            details: `Storage source updated successfully`,
            userId: id,
            resource: 'storage',
            metadata: storageData,
        });*/

        return await response.json();
    } catch (error) {
        /*await createLog({
            level: 'error',
            action: 'STORAGE_UPDATE',
            details: `Failed to update storage source`,
            userId: id,
            resource: 'storage',
            metadata: storageData,
        });*/
        throw new Error('Failed to update storage source');
    }
}

export async function createStorageAction(storageData: StorageProvider) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/connections`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(storageData),
        });

        if (!response.ok) throw new Error('Failed to create storage source');

        // const createdStorage = await response.json();
        // console.log(">>>>> ", createdStorage)
        //
        // if (!createdStorage.id) {
        //     throw new Error('Storage creation failed.');
        // }

        /*await createLog({
            level: 'info',
            action: 'STORAGE_CREATE',
            details: `Storage source created successfully`,
            userId: createdStorage.id,
            resource: 'storage',
            metadata: storageData,
        });*/

        return await response.json();
    } catch (error) {
        /*await createLog({
            level: 'error',
            action: 'STORAGE_CREATE',
            details: `Failed to create storage source`,
            userId: "",
            resource: 'storage',
            metadata: storageData,
        });*/
        throw new Error('Failed to create storage source');
    }
}

export async function fetchStorageAction() {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/connections`);
        if (!response.ok) throw new Error('Failed to fetch storage sources');
        const conn = await response.json();
        return conn;
         
    } catch (error) {
        throw new Error('Failed to fetch storage sources');
    }
}
