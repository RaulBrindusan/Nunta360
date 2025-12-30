const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');
require('dotenv').config();

const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

async function testList() {
  console.log('\n🔍 Testing R2 listing for: nunta360/uploads/thw0gei49ejjaga1/\n');

  const command = new ListObjectsV2Command({
    Bucket: process.env.R2_BUCKET_NAME,
    Prefix: 'nunta360/uploads/thw0gei49ejjaga1/',
  });

  try {
    const response = await r2Client.send(command);

    console.log('Bucket:', process.env.R2_BUCKET_NAME);
    console.log('Prefix:', 'nunta360/uploads/thw0gei49ejjaga1/');
    console.log('\nFiles found:', response.Contents?.length || 0);
    
    if (response.Contents) {
      response.Contents.forEach(file => {
        console.log('\n📄', file.Key);
        console.log('   Size:', file.Size, 'bytes');
        console.log('   URL:', `${process.env.R2_PUBLIC_URL}/${file.Key}`);
      });
    }
  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }

  process.exit();
}

testList();
