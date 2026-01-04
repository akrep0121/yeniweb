import { NextRequest, NextResponse } from 'next/server';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
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
    const blogsRef = collection(db, 'blogs');
    const snapshot = await getDocs(blogsRef);
    const blogs = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({ id: doc.id, ...doc.data() }));
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
    const blogsRef = collection(db, 'blogs');
    const docRef = await addDoc(blogsRef, blog);
    return { id: docRef.id, ...blog };
  } catch (error: any) {
    console.error('createBlog error:', error);
    throw error;
  }
}

export async function updateBlog(id: string, blog: any) {
  try {
    const blogRef = doc(db, 'blogs', id);
    await updateDoc(blogRef, blog);
    return { id, ...blog };
  } catch (error: any) {
    console.error('updateBlog error:', error);
    throw error;
  }
}

export async function deleteBlog(id: string) {
  try {
    const blogRef = doc(db, 'blogs', id);
    await deleteDoc(blogRef);
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
    const comments = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({ id: doc.id, ...doc.data() }));
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
    const comments = snapshot.docs.map((doc: QueryDocumentSnapshot<DocumentData>) => ({ id: doc.id, ...doc.data() }));
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