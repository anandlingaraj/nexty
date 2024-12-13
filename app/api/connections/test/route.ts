// app/api/connections/test/route.ts
import { NextResponse } from 'next/server';
import { S3Client, ListBucketsCommand } from '@aws-sdk/client-s3';
import { BlobServiceClient } from '@azure/storage-blob';
import { Storage } from '@google-cloud/storage';

async function testS3Connection(credentials: any) {
    try {
        const client = new S3Client({
            credentials: {
                accessKeyId: credentials.accessKeyId,
                secretAccessKey: credentials.secretAccessKey,
            },
            region: credentials.region || 'us-east-1'
        });

        await client.send(new ListBucketsCommand({}));
        return {
            success: true,
            message: 'Successfully connected to S3'
        };
    } catch (err) {
        return {
            success: false,
            error: `S3 Connection Error: ${err instanceof Error ? err.message : 'Unknown error'}`
        };
    }
}

async function testAzureConnection(credentials: any) {
    try {
        const blobServiceClient = BlobServiceClient.fromConnectionString(
            `DefaultEndpointsProtocol=https;AccountName=${credentials.accountName};AccountKey=${credentials.accountKey};EndpointSuffix=core.windows.net`
        );
        await blobServiceClient.getProperties();
        return {
            success: true,
            message: 'Successfully connected to Azure Blob Storage'
        };
    } catch (err) {
        return {
            success: false,
            error: `Azure Blob Connection Error: ${err instanceof Error ? err.message : 'Unknown error'}`
        };
    }
}

async function testGCPConnection(credentials: any) {
    try {
        const storage = new Storage({
            projectId: credentials.projectId,
            credentials: {
                client_email: credentials.clientEmail,
                private_key: credentials.privateKey.replace(/\\n/g, '\n'),
            }
        });

        await storage.getBuckets();
        return {
            success: true,
            message: 'Successfully connected to GCP Storage'
        };
    } catch (err) {
        return {
            success: false,
            error: `GCP Storage Connection Error: ${err instanceof Error ? err.message : 'Unknown error'}`
        };
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();

        if (!body || !body.type || !body.credentials) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Missing required parameters'
                },
                { status: 400 }
            );
        }

        const { type, credentials } = body;
        let testResult;

        switch (type) {
            case 'S3':
                testResult = await testS3Connection(credentials);
                break;
            case 'AZURE_BLOB':
                testResult = await testAzureConnection(credentials);
                break;
            case 'GCP_STORAGE':
                testResult = await testGCPConnection(credentials);
                break;
            default:
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Unsupported storage type'
                    },
                    { status: 400 }
                );
        }

        return NextResponse.json(testResult);

    } catch (error) {
        console.error('Error testing connection:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Failed to test connection'
            },
            { status: 500 }
        );
    }
}