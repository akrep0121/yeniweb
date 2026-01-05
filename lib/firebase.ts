import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { initializeApp, getApps, getApp } from 'firebase/app';
import path from 'path';

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

const BLOGS_FILE = path.join(process.cwd(), 'data', 'blogs.json');
const COMMENTS_FILE = path.join(process.cwd(), 'data', 'comments.json');

function getNextBlogId() {
  return Date.now().toString();
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/ç/g, 'c')
    .replace(/ğ/g, 'g')
    .replace(/ı/g, 'i')
    .replace(/ö/g, 'o')
    .replace(/ş/g, 's')
    .replace(/ü/g, 'u')
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '') + '-' + Date.now().toString().slice(-4);
}

export async function getBlogs() {
  try {
    console.log('=== GET BLOGS (FIREBASE ONLY) CALLED ===');
    
    const blogsRef = collection(db, 'blogs');
    const querySnapshot = await getDocs(blogsRef);
    const blogs: any[] = [];
    querySnapshot.forEach((doc) => {
      blogs.push({ id: doc.id, ...doc.data() });
    });
    
    console.log('Blogs from Firebase:', blogs.length);
    return blogs;
  } catch (error: any) {
    console.error('getBlogs error:', error);
    return [];
  }
}

export async function getBlogBySlug(slug: string) {
  try {
    const blogs = await getBlogs();
    const blog = blogs.find((b: any) => b.slug === slug);
    return blog;
  } catch (error: any) {
    console.error('getBlogBySlug error:', error);
    return null;
  }
}

export async function createBlog(blog: any) {
  try {
    console.log('=== CREATE BLOG (FIREBASE ONLY) CALLED ===');
    console.log('Input blog data:', JSON.stringify(blog, null, 2));

    const cleanedBlog: any = {};
    Object.keys(blog).forEach(key => {
      if (blog[key] !== undefined && blog[key] !== null && blog[key] !== '' && key !== 'id' && key !== 'type') {
        cleanedBlog[key] = blog[key];
      }
    });

    if (!cleanedBlog.slug || cleanedBlog.slug === '') {
      if (cleanedBlog.title) {
        cleanedBlog.slug = generateSlug(cleanedBlog.title);
        console.log('Generated slug from title:', cleanedBlog.slug);
      } else {
        cleanedBlog.slug = 'blog-' + Date.now();
        console.log('Generated default slug:', cleanedBlog.slug);
      }
    }

    console.log('Cleaned blog data:', JSON.stringify(cleanedBlog, null, 2));

    const blogsRef = collection(db, 'blogs');
    const docRef = await addDoc(blogsRef, cleanedBlog);
    
    console.log('=== FIREBASE DOC CREATED ===');
    console.log('Document ID:', docRef.id);

    const newBlog = { id: docRef.id, ...cleanedBlog };

    return newBlog;
  } catch (error: any) {
    console.error('=== CREATE BLOG (FIREBASE ONLY) ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    throw error;
  }
}

export async function updateBlog(id: string, blog: any) {
  try {
    console.log('=== UPDATE BLOG (FIREBASE ONLY) CALLED ===');
    console.log('Blog ID:', id);

    const cleanedBlog: any = {};
    Object.keys(blog).forEach(key => {
      if (blog[key] !== undefined && blog[key] !== null && blog[key] !== '' && key !== 'id' && key !== 'type') {
        cleanedBlog[key] = blog[key];
      }
    });

    const blogRef = doc(db, 'blogs', id);
    await updateDoc(blogRef, cleanedBlog);
    console.log('Blog updated in Firebase Firestore successfully');

    return { id, ...cleanedBlog };
  } catch (error: any) {
    console.error('updateBlog error (FIREBASE ONLY):', error);
    throw error;
  }
}

export async function deleteBlog(id: string) {
  try {
    console.log('=== DELETE BLOG (FIREBASE ONLY) CALLED ===');
    console.log('Blog ID to delete:', id);

    const blogRef = doc(db, 'blogs', id);
    await deleteDoc(blogRef);
    console.log('Blog deleted from Firebase Firestore successfully');
    
    return { success: true };
  } catch (error: any) {
    console.error('deleteBlog error (FIREBASE ONLY):', error);
    throw error;
  }
}

export async function getComments() {
  try {
    console.log('=== GET COMMENTS (FIREBASE) CALLED ===');
    
    const commentsRef = collection(db, 'comments');
    const querySnapshot = await getDocs(commentsRef);
    const comments: any[] = [];
    querySnapshot.forEach((doc) => {
      comments.push({ id: doc.id, ...doc.data() });
    });
    
    console.log('Comments from Firebase:', comments.length);
    return comments;
  } catch (error: any) {
    console.error('getComments error:', error);
    return [];
  }
}

export async function getCommentsByBlogId(blogId: string) {
  try {
    const comments = await getComments();
    const filteredComments = comments.filter((c: any) => c.blogId === blogId);
    return filteredComments;
  } catch (error: any) {
    console.error('getCommentsByBlogId error:', error);
    return [];
  }
}

export async function createComment(comment: any) {
  try {
    console.log('=== CREATE COMMENT (FIREBASE) CALLED ===');
    console.log('Comment data:', JSON.stringify(comment, null, 2));

    const cleanedComment: any = {};
    Object.keys(comment).forEach(key => {
      if (comment[key] !== undefined && comment[key] !== null && comment[key] !== '') {
        cleanedComment[key] = comment[key];
      }
    });

    cleanedComment.createdAt = new Date().toISOString();
    cleanedComment.approved = false;

    const commentsRef = collection(db, 'comments');
    const docRef = await addDoc(commentsRef, cleanedComment);
    
    console.log('=== FIREBASE COMMENT CREATED ===');
    console.log('Comment ID:', docRef.id);

    const newComment = { id: docRef.id, ...cleanedComment };

    return newComment;
  } catch (error: any) {
    console.error('=== CREATE COMMENT ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    throw error;
  }
}

export async function updateComment(id: string, comment: any) {
  try {
    console.log('=== UPDATE COMMENT CALLED ===');
    console.log('Comment ID:', id);

    const cleanedComment: any = {};
    Object.keys(comment).forEach(key => {
      if (comment[key] !== undefined && comment[key] !== null && comment[key] !== '') {
        cleanedComment[key] = comment[key];
      }
    });

    const commentRef = doc(db, 'comments', id);
    await updateDoc(commentRef, cleanedComment);
    console.log('Comment updated in Firebase Firestore successfully');

    return { id, ...cleanedComment };
  } catch (error: any) {
    console.error('updateComment error:', error);
    throw error;
  }
}

export async function deleteComment(id: string) {
  try {
    console.log('=== DELETE COMMENT CALLED ===');
    console.log('Comment ID:', id);

    const commentRef = doc(db, 'comments', id);
    await deleteDoc(commentRef);
    console.log('Comment deleted from Firebase Firestore successfully');
    
    return { success: true };
  } catch (error: any) {
    console.error('deleteComment error:', error);
    throw error;
  }
}

export async function getMessages() {
  try {
    console.log('=== GET MESSAGES (FIREBASE) CALLED ===');
    
    const messagesRef = collection(db, 'messages');
    const querySnapshot = await getDocs(messagesRef);
    const messages: any[] = [];
    querySnapshot.forEach((doc) => {
      messages.push({ id: doc.id, ...doc.data() });
    });
    
    console.log('Messages from Firebase:', messages.length);
    return messages;
  } catch (error: any) {
    console.error('getMessages error:', error);
    return [];
  }
}

export async function createMessage(message: any) {
  try {
    console.log('=== CREATE MESSAGE (FIREBASE) CALLED ===');
    console.log('Message data:', JSON.stringify(message, null, 2));

    const cleanedMessage: any = {};
    Object.keys(message).forEach(key => {
      if (message[key] !== undefined && message[key] !== null && message[key] !== '') {
        cleanedMessage[key] = message[key];
      }
    });

    cleanedMessage.createdAt = new Date().toISOString();
    cleanedMessage.read = false;

    const messagesRef = collection(db, 'messages');
    const docRef = await addDoc(messagesRef, cleanedMessage);
    
    console.log('=== FIREBASE MESSAGE CREATED ===');
    console.log('Message ID:', docRef.id);

    const newMessage = { id: docRef.id, ...cleanedMessage };

    return newMessage;
  } catch (error: any) {
    console.error('=== CREATE MESSAGE ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    throw error;
  }
}

export async function updateMessage(id: string, message: any) {
  try {
    console.log('=== UPDATE MESSAGE CALLED ===');
    console.log('Message ID:', id);

    const cleanedMessage: any = {};
    Object.keys(message).forEach(key => {
      if (message[key] !== undefined && message[key] !== null && message[key] !== '') {
        cleanedMessage[key] = message[key];
      }
    });

    const messageRef = doc(db, 'messages', id);
    await updateDoc(messageRef, cleanedMessage);
    console.log('Message updated in Firebase Firestore successfully');

    return { id, ...cleanedMessage };
  } catch (error: any) {
    console.error('updateMessage error:', error);
    throw error;
  }
}

export async function deleteMessage(id: string) {
  try {
    console.log('=== DELETE MESSAGE CALLED ===');
    console.log('Message ID:', id);

    const messageRef = doc(db, 'messages', id);
    await deleteDoc(messageRef);
    console.log('Message deleted from Firebase Firestore successfully');
    
    return { success: true };
  } catch (error: any) {
    console.error('deleteMessage error:', error);
    throw error;
  }
}
