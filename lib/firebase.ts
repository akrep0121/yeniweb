import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
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

async function loadBlogsFromFile() {
  try {
    const fs = await import('fs');
    const data = fs.default.readFileSync(BLOGS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error loading blogs from file:', error);
    return [];
  }
}

async function saveBlogsToFile(blogs: any[]) {
  try {
    const fs = await import('fs');
    fs.default.writeFileSync(BLOGS_FILE, JSON.stringify(blogs, null, 2));
    console.log('Blogs saved to file:', blogs.length);
  } catch (error) {
    console.error('Error saving blogs to file:', error);
  }
}

function getNextBlogId() {
  return Date.now().toString();
}

export async function getBlogs() {
  try {
    console.log('=== GET BLOGS (FIREBASE + FILE) CALLED ===');
    
    const blogsRef = collection(db, 'blogs');
    const querySnapshot = await getDocs(blogsRef);
    const firebaseBlogs: any[] = [];
    querySnapshot.forEach((doc) => {
      firebaseBlogs.push({ id: doc.id, ...doc.data() });
    });
    
    console.log('Blogs from Firebase:', firebaseBlogs.length);
    
    if (firebaseBlogs.length > 0) {
      return firebaseBlogs;
    }
    
    const fileBlogs = await loadBlogsFromFile();
    console.log('Blogs from file (fallback):', fileBlogs.length);
    return fileBlogs;
  } catch (error: any) {
    console.error('getBlogs error:', error);
    const fileBlogs = await loadBlogsFromFile();
    return fileBlogs;
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
    console.log('=== CREATE BLOG (FIREBASE FIRESTORE) CALLED ===');
    console.log('Input blog data:', JSON.stringify(blog, null, 2));

    const cleanedBlog: any = {};
    Object.keys(blog).forEach(key => {
      if (blog[key] !== undefined && blog[key] !== null && blog[key] !== '' && key !== 'id' && key !== 'type') {
        cleanedBlog[key] = blog[key];
      }
    });

    console.log('Cleaned blog data:', JSON.stringify(cleanedBlog, null, 2));

    const blogsRef = collection(db, 'blogs');
    const docRef = await addDoc(blogsRef, cleanedBlog);
    
    console.log('=== FIREBASE DOC CREATED ===');
    console.log('Document ID:', docRef.id);

    const newBlog = { id: docRef.id, ...cleanedBlog };
    
    try {
      const blogs = await loadBlogsFromFile();
      blogs.push(newBlog);
      await saveBlogsToFile(blogs);
      console.log('Blog also saved to file');
    } catch (fileError) {
      console.warn('Could not save to file, but Firebase create succeeded:', fileError);
    }

    return newBlog;
  } catch (error: any) {
    console.error('=== CREATE BLOG (FIREBASE FIRESTORE) ERROR ===');
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error code:', error.code);
    throw error;
  }
}

export async function updateBlog(id: string, blog: any) {
  try {
    console.log('=== UPDATE BLOG (FIREBASE FIRESTORE) CALLED ===');
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

    try {
      const blogs = await loadBlogsFromFile();
      const updatedBlogs = blogs.map((b: any) => 
        String(b.id) === String(id) ? { ...blog, id } : b
      );
      await saveBlogsToFile(updatedBlogs);
      console.log('Blog also updated in file');
    } catch (fileError) {
      console.warn('Could not update file, but Firebase update succeeded:', fileError);
    }

    return { id, ...cleanedBlog };
  } catch (error: any) {
    console.error('updateBlog error (FIREBASE FIRESTORE):', error);
    throw error;
  }
}

export async function deleteBlog(id: string) {
  try {
    console.log('=== DELETE BLOG (FIREBASE + FILE) CALLED ===');
    console.log('Blog ID to delete:', id);
    console.log('ID type:', typeof id);
    console.log('ID length:', id.length);

    let deletedFromFirestore = false;
    let deletedFromFile = false;

    try {
      const blogRef = doc(db, 'blogs', id);
      await deleteDoc(blogRef);
      deletedFromFirestore = true;
      console.log('Blog deleted from Firebase Firestore successfully');
    } catch (firestoreError: any) {
      console.log('Firebase delete:', firestoreError.code === 'not-found' ? 'Blog not found in Firestore (ok)' : 'Failed');
    }
    
    try {
      const blogs = await loadBlogsFromFile();
      console.log('File blogs before delete:', blogs.length);
      const filteredBlogs = blogs.filter((b: any) => String(b.id) !== String(id));
      console.log('File blogs after delete:', filteredBlogs.length);
      await saveBlogsToFile(filteredBlogs);
      deletedFromFile = true;
      console.log('Blog removed from file storage successfully');
    } catch (fileError) {
      console.error('Error updating file storage:', fileError);
    }
    
    if (!deletedFromFirestore && !deletedFromFile) {
      throw new Error('Blog could not be deleted from either Firestore or file storage');
    }
    
    console.log('Delete completed. Firestore:', deletedFromFirestore, 'File:', deletedFromFile);
    return { success: true, deletedFromFirestore, deletedFromFile };
  } catch (error: any) {
    console.error('deleteBlog error:', error);
    throw error;
  }
}

export async function getComments() {
  try {
    const fs = await import('fs');
    const data = fs.default.readFileSync('./data/comments.json', 'utf-8');
    const comments = JSON.parse(data);
    return comments;
  } catch (error: any) {
    console.error('getComments error:', error);
    return [];
  }
}

export async function getCommentsByBlogId(blogId: string) {
  try {
    const fs = await import('fs');
    const data = fs.default.readFileSync('./data/comments.json', 'utf-8');
    const comments = JSON.parse(data);
    const filteredComments = comments
      .filter((c: any) => c.blogId === blogId)
      .map((c: any) => ({ id: c.id, ...c }));
    return filteredComments;
  } catch (error: any) {
    console.error('getCommentsByBlogId error:', error);
    return [];
  }
}

export async function createComment(comment: any) {
  try {
    const fs = await import('fs');
    const data = fs.default.readFileSync('./data/comments.json', 'utf-8');
    const comments = JSON.parse(data);
    const newComment = {
      ...comment,
      id: Date.now().toString()
    };
    const updatedComments = [...comments, newComment];
    fs.default.writeFileSync('./data/comments.json', JSON.stringify(updatedComments, null, 2), 'utf-8');
    return newComment;
  } catch (error: any) {
    console.error('createComment error:', error);
    throw error;
  }
}

export async function updateComment(id: string, comment: any) {
  try {
    const fs = await import('fs');
    const data = fs.default.readFileSync('./data/comments.json', 'utf-8');
    const comments = JSON.parse(data);
    const updatedComments = comments.map((c: any) => 
      c.id === id ? comment : c
    );
    fs.default.writeFileSync('./data/comments.json', JSON.stringify(updatedComments, null, 2), 'utf-8');
    return { id, ...comment };
  } catch (error: any) {
    console.error('updateComment error:', error);
    throw error;
  }
}

export async function deleteComment(id: string) {
  try {
    const fs = await import('fs');
    const data = fs.default.readFileSync('./data/comments.json', 'utf-8');
    const comments = JSON.parse(data);
    const filteredComments = comments.filter((c: any) => c.id !== id);
    fs.default.writeFileSync('./data/comments.json', JSON.stringify(filteredComments, null, 2), 'utf-8');
    return { success: true };
  } catch (error: any) {
    console.error('deleteComment error:', error);
    throw error;
  }
}
