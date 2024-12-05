export interface StorageProvider {
    id: string;
    name: string;
    type: 'S3' | 'AZURE_BLOB' | 'GCP_STORAGE';
    credentials: Record<string, string>;
    isActive: boolean;
    createdAt: Date;
    lastChecked?: Date;
    status: 'connected' | 'error' | 'unchecked';
}

export const providerFields = {
    S3: [
        { key: 'accessKeyId', label: 'Access Key ID', type: 'text' },
        { key: 'secretAccessKey', label: 'Secret Access Key', type: 'password' },
        { key: 'region', label: 'Region', type: 'text' },
        { key: 'bucket', label: 'Bucket Name', type: 'text' }
    ],
    AZURE_BLOB: [
        { key: 'accountName', label: 'Storage Account Name', type: 'text' },
        { key: 'accountKey', label: 'Account Key', type: 'password' },
        { key: 'containerName', label: 'Container Name', type: 'text' }
    ],
    GCP_STORAGE: [
        { key: 'projectId', label: 'Project ID', type: 'text' },
        { key: 'clientEmail', label: 'Client Email', type: 'text' },
        { key: 'privateKey', label: 'Private Key', type: 'textarea' },
        { key: 'bucket', label: 'Bucket Name', type: 'text' }
    ]
};