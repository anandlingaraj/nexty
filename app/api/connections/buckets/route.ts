// app/api/storage/list-buckets/route.ts
import { NextResponse } from 'next/server';
import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';
import { BlobServiceClient } from '@azure/storage-blob';
import { Storage } from '@google-cloud/storage';

export async function POST(request: Request) {
    try {
        const { type, credentials } = await request.json();

        let buckets: { name: string; region?: string }[] = [];

        switch (type) {
            case 'S3':
                const s3Client = new S3Client({
                    credentials: {
                        accessKeyId: credentials.accessKeyId,
                        secretAccessKey: credentials.secretAccessKey,
                    },
                    region: credentials.region || 'us-east-1'
                });

                const s3Response = await s3Client.send(new ListBucketsCommand({}));
                buckets = s3Response.Buckets?.map(bucket => ({
                    name: bucket.Name!,
                })) || [];
                break;

            case 'AZURE_BLOB':
                const blobServiceClient = BlobServiceClient.fromConnectionString(
                    `DefaultEndpointsProtocol=https;AccountName=${credentials.accountName};AccountKey=${credentials.accountKey};EndpointSuffix=core.windows.net`
                );

                const containerIterator = blobServiceClient.listContainers();
                for await (const container of containerIterator) {
                    buckets.push({ name: container.name });
                }
                break;

            case 'GCP_STORAGE':
                const storage = new Storage({
                    projectId: credentials.projectId,
                    credentials: {
                        client_email: credentials.clientEmail,
                        private_key: credentials.privateKey,
                    },
                });

                const [gcpBuckets] = await storage.getBuckets();
                buckets = gcpBuckets.map(bucket => ({
                    name: bucket.name,
                }));
                break;
        }

        return NextResponse.json({ buckets });
    } catch (error) {
        console.error('Error listing buckets:', error);
        return NextResponse.json(
            { error: 'Failed to list buckets' },
            { status: 500 }
        );
    }
}