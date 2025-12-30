const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');
require('dotenv').config();

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

async function debugImages() {
  const filesRef = collection(db, 'uploaded_files');
  const snapshot = await getDocs(filesRef);
  
  console.log(`\n📸 Total files in Firestore: ${snapshot.size}\n`);
  
  snapshot.forEach(doc => {
    const data = doc.data();
    console.log('─────────────────────────────');
    console.log('File:', data.fileName);
    console.log('Slug:', data.slug);
    console.log('Full URL:', data.downloadURL);
    console.log('Storage Path:', data.storagePath);
    console.log('File Type:', data.fileType);
    console.log('');
  });
  
  process.exit();
}

debugImages();
