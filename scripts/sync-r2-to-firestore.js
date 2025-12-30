const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, serverTimestamp, query, where, getDocs } = require('firebase/firestore');
const { S3Client, ListObjectsV2Command } = require('@aws-sdk/client-s3');
require('dotenv').config();

// Initialize Firebase
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Initialize R2
const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.R2_ENDPOINT.replace('/nunta360', ''),
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
  },
});

const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;
const R2_PUBLIC_URL = process.env.R2_PUBLIC_URL;

async function getPageIdForSlug(slug) {
  const pagesRef = collection(db, 'qr_pages');
  const q = query(pagesRef, where('slug', '==', slug));
  const snapshot = await getDocs(q);

  if (snapshot.empty) {
    console.log(`❌ No QR page found for slug: ${slug}`);
    return null;
  }

  return snapshot.docs[0].id;
}

async function syncR2ToFirestore(slug) {
  console.log(`\n🔄 Syncing R2 files for slug: ${slug}\n`);

  // Get pageId
  const pageId = await getPageIdForSlug(slug);
  if (!pageId) {
    console.log('⚠️  Please create a QR page for this slug first.');
    return;
  }

  try {
    // List files from R2
    const command = new ListObjectsV2Command({
      Bucket: R2_BUCKET_NAME,
      Prefix: `nunta360/uploads/${slug}/`,
    });

    const response = await r2Client.send(command);

    if (!response.Contents || response.Contents.length === 0) {
      console.log(`❌ No files found in R2 at: nunta360/uploads/${slug}/`);
      return;
    }

    console.log(`✅ Found ${response.Contents.length} files in R2\n`);

    // Create Firestore records for each file
    let created = 0;
    for (const file of response.Contents) {
      const key = file.Key;
      const fileName = key.split('/').pop();

      // Skip if it's just the folder
      if (!fileName) continue;

      // Determine file type from extension
      const ext = fileName.split('.').pop().toLowerCase();
      let fileType = 'application/octet-stream';
      if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
        fileType = `image/${ext === 'jpg' ? 'jpeg' : ext}`;
      } else if (['mp4', 'mov', 'avi', 'webm'].includes(ext)) {
        fileType = `video/${ext}`;
      }

      const downloadURL = `${R2_PUBLIC_URL}/${key}`;

      // Create Firestore document
      await addDoc(collection(db, 'uploaded_files'), {
        pageId: pageId,
        slug: slug,
        fileName: fileName,
        fileType: fileType,
        fileSize: file.Size,
        downloadURL: downloadURL,
        storagePath: key,
        uploadedAt: serverTimestamp(),
      });

      console.log(`✅ Created Firestore record for: ${fileName}`);
      created++;
    }

    console.log(`\n🎉 Successfully synced ${created} files to Firestore!`);
    console.log(`\n📱 Visit: https://nunta360.vercel.app/upload/${slug}`);

  } catch (error) {
    console.error('❌ Error syncing files:', error);
  }

  process.exit();
}

// Get slug from command line argument
const slug = process.argv[2];

if (!slug) {
  console.log('❌ Please provide a slug:');
  console.log('   node scripts/sync-r2-to-firestore.js YOUR_SLUG_ID');
  process.exit(1);
}

syncR2ToFirestore(slug);
