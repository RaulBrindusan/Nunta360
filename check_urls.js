const { initializeApp } = require('firebase/app');
const { getFirestore, collection, query, where, getDocs } = require('firebase/firestore');
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

async function checkURLs() {
  const q = query(collection(db, 'uploaded_files'), where('slug', '==', 'elzveqzc74adlxbo'));
  const snapshot = await getDocs(q);
  
  console.log(`\nFound ${snapshot.size} files:\n`);
  
  snapshot.forEach(doc => {
    const data = doc.data();
    console.log('File:', data.fileName);
    console.log('Download URL:', data.downloadURL);
    console.log('Storage Path:', data.storagePath);
    console.log('---\n');
  });
  
  process.exit();
}

checkURLs();
