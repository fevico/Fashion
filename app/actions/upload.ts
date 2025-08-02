// /app/actions/upload.ts
'use server';

import { put } from '@vercel/blob';
import { revalidatePath } from 'next/cache';

export async function uploadFile(formData: FormData, type: 'avatar' | 'clothing') {
  const file = formData.get('file') as File;

  if (!file) {
    throw new Error('No file uploaded');
  }

  if (!file.name.endsWith('.glb') && !file.name.endsWith('.gltf')) {
    throw new Error('Only .glb or .gltf files are supported');
  }

  const maxSize = 4.5 * 1024 * 1024; // 4.5 MB
  if (file.size > maxSize) {
    throw new Error(`File size exceeds 4.5 MB limit (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
  }

  try {
    const blob = await put(file.name, file, { access: 'public' });
    console.log(`File saved to Blob for ${type}: ${blob.url}`);
    revalidatePath('/'); // Optional: Revalidate the page if needed
    return { url: blob.url };
  } catch (err) {
    console.error('Upload error details:', {
      message: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined,
    });
    throw new Error('Failed to upload file. Check server logs for details.');
  }
}