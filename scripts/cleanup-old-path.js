const { S3Client, ListObjectsV2Command, DeleteObjectsCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;

async function cleanupOldPath(slug) {
  console.log(`\n🗑️  Cleaning up old path for slug: ${slug}\n`);

  const oldPrefix = `nunta360/nunta360/uploads/${slug}/`;

  try {
    // List files from old path
    const listCommand = new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
      Prefix: oldPrefix,
    });

    const response = await r2Client.send(listCommand);

    if (!response.Contents || response.Contents.length === 0) {
      console.log(`✅ No files found in old path: ${oldPrefix}`);
      console.log('Nothing to clean up!\n');
      return;
    }

    console.log(`📁 Found ${response.Contents.length} files in old path:\n`);

    response.Contents.forEach(file => {
      console.log(`  - ${file.Key}`);
    });

    console.log('\n⚠️  WARNING: This will DELETE all these files!');
    console.log('Make sure files exist in the new path: nunta360/uploads/${slug}/\n');

    // Prepare delete command
    const objectsToDelete = response.Contents.map(file => ({ Key: file.Key }));

    const deleteCommand = new DeleteObjectsCommand({
      Bucket: R2_BUCKET_NAME,
      Delete: {
        Objects: objectsToDelete,
      },
    });

    // Delete files
    const deleteResponse = await r2Client.send(deleteCommand);

    console.log(`\n✅ Successfully deleted ${deleteResponse.Deleted?.length || 0} files`);

    if (deleteResponse.Errors && deleteResponse.Errors.length > 0) {
      console.log(`\n❌ Errors:`, deleteResponse.Errors);
    }

  } catch (error) {
    console.error('❌ Error cleaning up:', error.message);
  }

  process.exit();
}

// Get slug from command line
const slug = process.argv[2];

if (!slug) {
  console.log('❌ Please provide a slug:');
  console.log('   node scripts/cleanup-old-path.js YOUR_SLUG_ID');
  process.exit(1);
}

cleanupOldPath(slug);
