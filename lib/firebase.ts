import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
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
    console.log('=== GET BLOGS (CLIENT SDK + FILE STORAGE) CALLED ===');
    
    let blogs = await loadBlogsFromFile();
    
    console.log('Blogs loaded successfully (CLIENT SDK + FILE STORAGE):', blogs.length);
    return blogs;
  } catch (error: any) {
    console.error('getBlogs error (CLIENT SDK + FILE STORAGE):', error);
    return [];
  }
}

export async function getBlogBySlug(slug: string) {
  try {
    const blogs = await loadBlogsFromFile();
    const blog = blogs.find((b: any) => b.slug === slug);
    return blog;
  } catch (error: any) {
    console.error('getBlogBySlug error (CLIENT SDK + FILE STORAGE):', error);
    return null;
  }
}

export async function createBlog(blog: any) {
  try {
    console.log('=== CREATE BLOG (CLIENT SDK + FILE STORAGE) CALLED ===');
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

    const blogsRef = collection(db, 'blogs');
    const docRef = await addDoc(blogsRef, cleanedBlog);
    
    console.log('=== FIREBASE DOC CREATED ===');
    console.log('Document ID:', docRef.id);
    console.log('Document ID type:', typeof docRef.id);
    console.log('Document ID length:', docRef.id?.length);
    console.log('Document ID value:', `"${docRef.id}"`);
    console.log('Document ID exists:', !!docRef.id);
    console.log('Document ref object:', docRef);
    console.log('Document ref metadata:', JSON.stringify({
      id: docRef.id,
      type: typeof docRef.id,
      path: docRef.path
    }, null, 2));

    return { id: docRef.id, ...blog };
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
    console.log('=== UPDATE BLOG (CLIENT SDK + FILE STORAGE) CALLED ===');
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
    console.log('Blog updated successfully (CLIENT SDK + FILE STORAGE)');

    return { id, ...blog };
  } catch (error: any) {
    console.error('updateBlog error (CLIENT SDK + FILE STORAGE):', error);
    throw error;
  }
}

export async function deleteBlog(id: string) {
  try {
    console.log('=== DELETE BLOG (CLIENT SDK + FILE STORAGE) CALLED ===');
    console.log('Blog ID to delete:', id);

    const blogs = await loadBlogsFromFile();
    const filteredBlogs = blogs.filter((b: any) => String(b.id) !== String(id));
    
    await saveBlogsToFile(filteredBlogs);
    
    console.log('Blog deleted successfully (CLIENT SDK + FILE STORAGE)');
    return { success: true };
  } catch (error: any) {
    console.error('deleteBlog error (CLIENT SDK + FILE STORAGE):', error);
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
    console.error('getComments error (CLIENT SDK + FILE STORAGE):', error);
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
      .map((c: any) => ({ id: c.id, ...c.data() }));
    return filteredComments;
  } catch (error: any) {
    console.error('getCommentsByBlogId error (CLIENT SDK + FILE STORAGE):', error);
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
    console.error('createComment error (CLIENT SDK + FILE STORAGE):', error);
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
    console.error('updateComment error (CLIENT SDK + FILE STORAGE):', error);
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
    console.error('deleteComment error (CLIENT SDK + FILE STORAGE):', error);
    throw error;
  }
}

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
    fs.default.writeFileSync(BLOGS_FILE, JSON.stringify(blogs, null, 2), 'utf-8');
    console.log('Blogs saved to file:', blogs.length);
  } catch (error) {
    console.error('Error saving blogs to file:', error);
  }
  }
}

export async function getBlogs() {
  try {
    console.log('=== GET BLOGS (CLIENT SDK + FILE STORAGE) CALLED ===');
    
    let blogs = await loadBlogsFromFile();
    
    console.log('Blogs from file:', blogs.length);
    return blogs;
  } catch (error: any) {
    console.error('getBlogs error:', error);
    return [];
  }
}

export async function getBlogBySlug(slug: string) {
  try {
    const blogs = await loadBlogsFromFile();
    const blog = blogs.find((b: any) => b.slug === slug);
    return blog;
  } catch (error: any) {
    console.error('getBlogBySlug error:', error);
    return null;
  }
}

export async function createBlog(blog: any) {
  try {
    console.log('=== CREATE BLOG (CLIENT SDK + FILE STORAGE) CALLED ===');
    console.log('Input blog data:', JSON.stringify(blog, null, 2));
    console.log('Blog ID:', blog.id);

    const blogs = await loadBlogsFromFile();
    const newBlog = {
      ...blog,
      id: blog.id || getNextBlogId()
    };
    
    const updatedBlogs = [...blogs, newBlog];
    await saveBlogsToFile(updatedBlogs);
    
    console.log('Blog added with ID:', newBlog.id);
    console.log('Total blogs:', updatedBlogs.length);
    
    return newBlog;
  } catch (error: any) {
    console.error('createBlog error:', error);
    throw error;
  }
}

export async function updateBlog(id: string, blog: any) {
  try {
    console.log('=== UPDATE BLOG (CLIENT SDK + FILE STORAGE) CALLED ===');
    console.log('Blog ID:', id);

    const blogs = await loadBlogsFromFile();
    const updatedBlogs = blogs.map((b: any) => 
      b.id === id ? blog : b
    );
    
    await saveBlogsToFile(updatedBlogs);
    
    console.log('Blog updated successfully');
    
    return { id, ...blog };
  } catch (error: any) {
    console.error('updateBlog error:', error);
    throw error;
  }
}

export async function deleteBlog(id: string) {
  try {
    console.log('=== DELETE BLOG (CLIENT SDK + FILE STORAGE) CALLED ===');
    console.log('Blog ID:', id);

    const blogs = await loadBlogsFromFile();
    const filteredBlogs = blogs.filter((b: any) => String(b.id) !== String(id));
    
    await saveBlogsToFile(filteredBlogs);
    
    console.log('Blog deleted successfully');
    console.log('Remaining blogs:', filteredBlogs.length);
    
    return { success: true };
  } catch (error: any) {
    console.error('deleteBlog error:', error);
    throw error;
  }
}

export async function getComments() {
  try {
    const fs = await import('fs');
    const data = fs.default.readFileSync('./data/comments.json', 'utf-8');
    return JSON.parse(data);
  } catch (error: any) {
    console.error('getComments error:', error);
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
    console.error('Full error:', error);
    throw error;
  }
}
