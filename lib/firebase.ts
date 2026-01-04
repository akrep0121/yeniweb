import { getAuth } from 'firebase/auth';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { initializeApp, getApps, getApp } from 'firebase/app';

const firebaseConfig = {
  apiKey: "AIzaSyB1mttBC7g59HO_x7QQtqJmbbttR5DFe5E",
  authDomain: "yeni-proje-21ad7.firebaseapp.com",
  projectId: "yeni-proje-21ad7",
  storageBucket: "yeni-proje-21ad7.firebasestorage.app",
  messagingSenderId: "409863949724",
  appId: "1:409863949724:web:f846a1a12250120c0c0c59",
  measurementId: "G-S90NTJZ3S6"
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };

export async function getBlogs() {
  try {
    console.log('=== GET BLOGS (CLIENT SDK) CALLED ===');
    const blogsRef = collection(db, 'blogs');
    const snapshot = await getDocs(blogsRef);
    const blogs = snapshot.docs.map((doc: QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() }));
    console.log('Blogs loaded successfully (CLIENT SDK):', blogs.length);
    return blogs;
  } catch (error: any) {
    console.error('getBlogs error (CLIENT SDK):', error);
    return [];
  }
}

export async function getBlogBySlug(slug: string) {
  try {
    const blogsRef = collection(db, 'blogs');
    const q = query(blogsRef, where('slug', '==', slug));
    const snapshot = await getDocs(q);
    if (snapshot.empty) return null;
    const doc = snapshot.docs[0];
    return { id: doc.id, ...doc.data() };
  } catch (error: any) {
    console.error('getBlogBySlug error (CLIENT SDK):', error);
    return null;
  }
}

export async function createBlog(blog: any) {
  try {
    console.log('=== CREATE BLOG (CLIENT SDK) CALLED ===');
    console.log('Input blog data:', JSON.stringify(blog, null, 2));

    const cleanedBlog: any = {};
    Object.keys(blog).forEach(key => {
      if (blog[key] !== undefined && blog[key] !== null) {
        cleanedBlog[key] = blog[key];
      } else {
        console.log(`Skipping undefined/null field: ${key}`);
      }
    });

    console.log('Cleaned blog data:', JSON.stringify(cleanedBlog, null, 2));

    console.log('=== BEFORE FIREBASE ADD DOC ===');
    console.log('Firebase app instance:', getApps());
    console.log('Firestore db instance:', db);
    console.log('Collection reference:', collection(db, 'blogs'));

    const blogsRef = collection(db, 'blogs');
    const docRef = await addDoc(blogsRef, cleanedBlog);

    console.log('=== AFTER FIREBASE ADD DOC ===');
    console.log('Document reference (docRef):', docRef);
    console.log('Document ID (docRef.id):', docRef.id);
    console.log('Document ID type:', typeof docRef.id);
    console.log('Document ID exists:', !!docRef.id);
    console.log('Document ID null check:', docRef.id === null);
    console.log('Document ID string:', String(docRef.id));
    console.log('Document ID length:', docRef.id?.length);
    console.log('Document ID value:', `"${docRef.id}"`);

    const blogWithId = { id: docRef.id, ...blog };
    console.log('Blog object to return:', JSON.stringify(blogWithId, null, 2));

    return blogWithId;
  } catch (error: any) {
    console.error('=== CREATE BLOG (CLIENT SDK) ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Error stack:', error.stack);
    console.error('Full error:', error);
    throw error;
  }
}

export async function updateBlog(id: string, blog: any) {
  try {
    console.log('=== UPDATE BLOG (CLIENT SDK) CALLED ===');
    console.log('Blog ID:', id);
    console.log('Blog data:', JSON.stringify(blog, null, 2));

    const cleanedBlog: any = {};
    Object.keys(blog).forEach(key => {
      if (blog[key] !== undefined && blog[key] !== null) {
        cleanedBlog[key] = blog[key];
      }
    });

    const blogRef = doc(db, 'blogs', id);
    await updateDoc(blogRef, cleanedBlog);
    console.log('Blog updated successfully (CLIENT SDK)');

    return { id, ...blog };
  } catch (error: any) {
    console.error('updateBlog error (CLIENT SDK):', error);
    throw error;
  }
}

export async function deleteBlog(id: string) {
  try {
    console.log('=== DELETE BLOG (CLIENT SDK) CALLED ===');
    console.log('Blog ID to delete:', id);

    const blogRef = doc(db, 'blogs', id);
    await deleteDoc(blogRef);
    console.log('Blog deleted successfully (CLIENT SDK)');

    return { success: true };
  } catch (error: any) {
    console.error('deleteBlog error (CLIENT SDK):', error);
    throw error;
  }
}

export async function getComments() {
  try {
    const commentsRef = collection(db, 'comments');
    const snapshot = await getDocs(commentsRef);
    const comments = snapshot.docs.map((doc: QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() }));
    return comments;
  } catch (error: any) {
    console.error('getComments error (CLIENT SDK):', error);
    return [];
  }
}

export async function getCommentsByBlogId(blogId: string) {
  try {
    const commentsRef = collection(db, 'comments');
    const q = query(commentsRef, where('blogId', '==', blogId));
    const snapshot = await getDocs(q);
    const comments = snapshot.docs
      .filter((doc: QueryDocumentSnapshot) => doc.data().blogId === blogId)
      .map((doc: QueryDocumentSnapshot) => ({ id: doc.id, ...doc.data() }));
    return comments;
  } catch (error: any) {
    console.error('getCommentsByBlogId error (CLIENT SDK):', error);
    return [];
  }
}

export async function createComment(comment: any) {
  try {
    const commentsRef = collection(db, 'comments');
    const docRef = await addDoc(commentsRef, comment);
    return { id: docRef.id, ...comment };
  } catch (error: any) {
    console.error('createComment error (CLIENT SDK):', error);
    throw error;
  }
}

export async function updateComment(id: string, comment: any) {
  try {
    const commentRef = doc(db, 'comments', id);
    await updateDoc(commentRef, comment);
    return { id, ...comment };
  } catch (error: any) {
    console.error('updateComment error (CLIENT SDK):', error);
    throw error;
  }
}

export async function deleteComment(id: string) {
  try {
    const commentRef = doc(db, 'comments', id);
    await deleteDoc(commentRef);
    return { success: true };
  } catch (error: any) {
    console.error('deleteComment error (CLIENT SDK):', error);
    throw error;
  }
}
