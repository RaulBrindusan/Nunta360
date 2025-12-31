import { NextRequest, NextResponse } from 'next/server';
import { S3Client, ListObjectsV2Command, GetObjectCommand } from '@aws-sdk/client-s3';
import archiver from 'archiver';
import { Readable } from 'stream';

const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
  },
});

const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || '';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const slug = searchParams.get('slug');

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      );
    }

    const prefix = `nunta360/uploads/${slug}/`;

    // List all objects in the folder
    const listCommand = new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
      Prefix: prefix,
    });

    const listResponse = await r2Client.send(listCommand);

    if (!listResponse.Contents || listResponse.Contents.length === 0) {
      return NextResponse.json(
        { error: 'No files found' },
        { status: 404 }
      );
    }

    // Create a zip archive
    const archive = archiver('zip', {
      zlib: { level: 9 } // Maximum compression
    });

    // Create a readable stream from the archive
    const stream = new ReadableStream({
      start(controller) {
        archive.on('data', (chunk) => {
          controller.enqueue(chunk);
        });

        archive.on('end', () => {
          controller.close();
        });

        archive.on('error', (err) => {
          controller.error(err);
        });

        // Add all files to the archive
        Promise.all(
          listResponse.Contents.map(async (object) => {
            if (!object.Key) return;

            const getCommand = new GetObjectCommand({
              Bucket: R2_BUCKET_NAME,
              Key: object.Key,
            });

            const response = await r2Client.send(getCommand);

            if (response.Body) {
              const fileName = object.Key.split('/').pop() || 'file';
              const stream = response.Body as Readable;
              archive.append(stream, { name: fileName });
            }
          })
        ).then(() => {
          archive.finalize();
        }).catch((err) => {
          console.error('Error adding files to archive:', err);
          archive.emit('error', err);
        });
      },
    });

    return new NextResponse(stream, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="nunta360-media-${slug}.zip"`,
      },
    });
  } catch (error) {
    console.error('Download all error:', error);
    return NextResponse.json(
      { error: 'Failed to create zip archive' },
      { status: 500 }
    );
  }
}
