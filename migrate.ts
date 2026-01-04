import fs from 'fs';
import path from 'path';
import { collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from './lib/firebase.js';

const BLOGS_FILE = path.join(process.cwd(), 'data', 'blogs.json');

async function migrateBlogs() {
  try {
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
    console.error('Migration hatası:', error);
  }
}

migrateBlogs().then(() => {
  console.log('Migration script tamamlandı');
  process.exit(0);
}).catch((error) => {
  console.error('Migration script hatası:', error);
  process.exit(1);
});
