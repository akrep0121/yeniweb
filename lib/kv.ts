import { kv } from '@vercel/kv';

export async function getBlogs() {
  try {
    const blogs = await kv.get('blogs');
    if (!blogs) {
      return [];
    }
    return JSON.parse(typeof blogs === 'string' ? blogs : '{}');
  } catch (error: any) {
    console.error('KV getBlogs error:', error);
    return [];
  }
}

export async function saveBlogsLocally(blogs: any[]) {
  try {
    const fs = await import('fs');
    const path = await import('path');
    const BLOGS_FILE = path.default.join(process.cwd(), 'data', 'blogs.json');

    fs.default.writeFileSync(BLOGS_FILE, JSON.stringify(blogs, null, 2));
    console.log('Blogs saved locally:', blogs.length);
  } catch (error: any) {
    console.error('Save blogs locally error:', error);
  }
}

export async function syncToKV(blogs: any[]) {
  try {
    await kv.set('blogs', JSON.stringify(blogs));
    console.log('Blogs synced to KV:', blogs.length);
  } catch (error: any) {
    console.error('Sync to KV error:', error);
  }
}
