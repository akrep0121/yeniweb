const fs = require('fs');
const path = require('path');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, deleteDoc } = require('firebase/firestore');
const { getAuth, signInWithEmailAndPassword } = require('firebase/auth');

const firebaseConfig = {
  apiKey: "AIzaSyB1mttBC7g59HO_x7QQtqJmbbttR5DFe5E",
  authDomain: "yeni-proje-21ad7.firebaseapp.com",
  projectId: "yeni-proje-21ad7",
  storageBucket: "yeni-proje-21ad7.firebasestorage.app",
  messagingSenderId: "409863949724",
  appId: "1:409863949724:web:f846a1a12250120c0c0c59",
  measurementId: "G-S90NTJZ3S6"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const BLOGS_FILE = path.join(process.cwd(), 'data', 'blogs.json');
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'KJSA1660';

async function migrateBlogs() {
  try {
    console.log('Firebase Authentication başlatılıyor...');

    await signInWithEmailAndPassword(auth, ADMIN_EMAIL, ADMIN_PASSWORD);
    console.log('Authentication başarılı!');

    console.log('Migration başlatılıyor...');

    const blogsData = JSON.parse(fs.readFileSync(BLOGS_FILE, 'utf-8'));
    console.log(`${blogsData.length} blog bulundu`);

    const blogsRef = collection(db, 'blogs');

    const snapshot = await getDocs(blogsRef);
    console.log(`${snapshot.docs.length} mevcut blog Firestore'da bulundu`);

    if (snapshot.docs.length > 0) {
      console.log('Firestore\'daki mevcut bloglar siliniyor...');

      for (const doc of snapshot.docs) {
        await deleteDoc(doc.ref);
      }
      console.log('Mevcut bloglar silindi');
    }

    for (const blog of blogsData) {
      const { id, ...blogData } = blog;

      await addDoc(blogsRef, {
        ...blogData,
        createdAt: new Date(blogData.publishedAt || new Date())
      });
      console.log(`Blog eklendi: ${blog.title}`);
    }

    console.log('Migration tamamlandı!');
    console.log(`${blogsData.length} blog Firestore\'a aktarıldı`);
  } catch (error) {
    console.error('Migration hatası:', error.message);
  }
}

migrateBlogs().then(() => {
  console.log('Migration script tamamlandı');
  process.exit(0);
}).catch((error) => {
  console.error('Migration script hatası:', error);
  process.exit(1);
});
