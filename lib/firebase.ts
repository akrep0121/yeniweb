import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

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
    console.log('=== GET BLOGS CALLED ===');
    const blogsRef = collection(db, 'blogs');
    const snapshot = await getDocs(blogsRef);
    const blogs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log('Blogs loaded successfully:', blogs.length);
    return blogs;
  } catch (error: any) {
    console.error('getBlogs error:', error);
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
    console.error('getBlogBySlug error:', error);
    return null;
  }
}

export async function createBlog(blog: any) {
  try {
    console.log('=== CREATE BLOG WITH AUTH CALLED ===');
    console.log('Input blog data:', JSON.stringify(blog, null, 2));

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || '';

    console.log('Admin email:', adminEmail);
    console.log('Admin password exists:', !!adminPassword);

    if (!adminPassword) {
      console.error('ADMIN_PASSWORD environment variable not set');
      throw new Error('ADMIN_PASSWORD not set');
    }

    try {
      console.log('Attempting Firebase authentication...');
      const userCredential = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      console.log('Firebase authentication successful:', userCredential.user.email);
    } catch (authError: any) {
      console.error('Firebase authentication failed:', authError.code, authError.message);
      throw new Error(`Authentication failed: ${authError.message}`);
    }

    const cleanedBlog: any = {};
    Object.keys(blog).forEach(key => {
      if (blog[key] !== undefined && blog[key] !== null) {
        cleanedBlog[key] = blog[key];
      } else {
        console.log(`Skipping undefined/null field: ${key}`);
      }
    });

    console.log('Cleaned blog data:', JSON.stringify(cleanedBlog, null, 2));

    const blogsRef = collection(db, 'blogs');
    const docRef = await addDoc(blogsRef, cleanedBlog);
    console.log('Firebase document created with ID:', docRef.id);

    return { id: docRef.id, ...blog };
  } catch (error: any) {
    console.error('=== CREATE BLOG WITH AUTH ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    console.error('Full error:', error);
    throw error;
  }
}

export async function updateBlog(id: string, blog: any) {
  try {
    console.log('=== UPDATE BLOG CALLED ===');
    console.log('Blog ID:', id);
    console.log('Blog data:', JSON.stringify(blog, null, 2));

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || '';

    try {
      const userCredential = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      console.log('Firebase authentication successful for update');
    } catch (authError: any) {
      console.error('Firebase authentication failed for update:', authError.code, authError.message);
      throw new Error(`Authentication failed: ${authError.message}`);
    }

    const blogRef = doc(db, 'blogs', id);
    await updateDoc(blogRef, blog);
    console.log('Blog updated successfully');

    return { id, ...blog };
  } catch (error: any) {
    console.error('updateBlog error:', error);
    throw error;
  }
}

export async function deleteBlog(id: string) {
  try {
    console.log('=== DELETE BLOG CALLED ===');
    console.log('Blog ID to delete:', id);

    const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com';
    const adminPassword = process.env.ADMIN_PASSWORD || '';

    try {
      const userCredential = await signInWithEmailAndPassword(auth, adminEmail, adminPassword);
      console.log('Firebase authentication successful for delete');
    } catch (authError: any) {
      console.error('Firebase authentication failed for delete:', authError.code, authError.message);
      throw new Error(`Authentication failed: ${authError.message}`);
    }

    const blogRef = doc(db, 'blogs', id);
    await deleteDoc(blogRef);
    console.log('Blog deleted successfully');

    return { success: true };
  } catch (error: any) {
    console.error('deleteBlog error:', error);
    throw error;
  }
}

export async function getComments() {
  try {
    const commentsRef = collection(db, 'comments');
    const snapshot = await getDocs(commentsRef);
    const comments = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return comments;
  } catch (error: any) {
    console.error('getComments error:', error);
    return [];
  }
}

export async function getCommentsByBlogId(blogId: string) {
  try {
    const commentsRef = collection(db, 'comments');
    const q = query(commentsRef, where('blogId', '==', blogId));
    const snapshot = await getDocs(q);
    const comments = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    return comments;
  } catch (error: any) {
    console.error('getCommentsByBlogId error:', error);
    return [];
  }
}

export async function createComment(comment: any) {
  try {
    const commentsRef = collection(db, 'comments');
    const docRef = await addDoc(commentsRef, comment);
    return { id: docRef.id, ...comment };
  } catch (error: any) {
    console.error('createComment error:', error);
    throw error;
  }
}

export async function updateComment(id: string, comment: any) {
  try {
    const commentRef = doc(db, 'comments', id);
    await updateDoc(commentRef, comment);
    return { id, ...comment };
  } catch (error: any) {
    console.error('updateComment error:', error);
    throw error;
  }
}

export async function deleteComment(id: string) {
  try {
    const commentRef = doc(db, 'comments', id);
    await deleteDoc(commentRef);
    return { success: true };
  } catch (error: any) {
    console.error('deleteComment error:', error);
    throw error;
  }
}
