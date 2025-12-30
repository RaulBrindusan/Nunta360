import { NextRequest, NextResponse } from 'next/server';
import { ListObjectsV2Command } from '@aws-sdk/client-s3';
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from '@/lib/r2';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { error: 'Slug is required' },
        { status: 400 }
      );
    }

    // List files from R2
    const command = new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
      Prefix: `nunta360/nunta360/uploads/${slug}/`,
    });

    const response = await r2Client.send(command);

    if (!response.Contents || response.Contents.length === 0) {
      return NextResponse.json({ files: [] });
    }

    // Map R2 objects to file metadata
    const files = response.Contents.map((file) => {
      const fileName = file.Key?.split('/').pop() || '';
      const ext = fileName.split('.').pop()?.toLowerCase() || '';

      // Determine file type
      let fileType = 'application/octet-stream';
      if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
        fileType = `image/${ext === 'jpg' ? 'jpeg' : ext}`;
      } else if (['mp4', 'mov', 'avi', 'webm'].includes(ext)) {
        fileType = `video/${ext}`;
      }

      return {
        fileName,
        fileType,
        fileSize: file.Size || 0,
        downloadURL: `${R2_PUBLIC_URL}/${file.Key}`,
        storagePath: file.Key,
        lastModified: file.LastModified?.toISOString(),
      };
    }).filter(file => file.fileName); // Filter out folders

    return NextResponse.json({ files });
  } catch (error) {
    console.error('Error listing R2 files:', error);
    return NextResponse.json(
      { error: 'Failed to list files' },
      { status: 500 }
    );
  }
}
