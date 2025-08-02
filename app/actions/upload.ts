// /app/actions/upload.ts
// 'use server';

// import { put } from '@vercel/blob';
// import { revalidatePath } from 'next/cache';

// export async function uploadFile(formData: FormData, type: 'avatar' | 'clothing') {
//   const file = formData.get('file') as File;

//   if (!file) {
//     throw new Error('No file uploaded');
//   }

//   if (!file.name.endsWith('.glb') && !file.name.endsWith('.gltf')) {
//     throw new Error('Only .glb or .gltf files are supported');
//   }

//   const maxSize = 4.5 * 1024 * 1024; // 4.5 MB
//   if (file.size > maxSize) {
//     throw new Error(`File size exceeds 4.5 MB limit (${(file.size / 1024 / 1024).toFixed(2)} MB)`);
//   }

//   try {
//     const blob = await put(file.name, file, { access: 'public' });
//     console.log(`File saved to Blob for ${type}: ${blob.url}`);
//     revalidatePath('/'); // Optional: Revalidate the page if needed
//     return { url: blob.url };
//   } catch (err) {
//     console.error('Upload error details:', {
//       message: err instanceof Error ? err.message : 'Unknown error',
//       stack: err instanceof Error ? err.stack : undefined,
//     });
//     throw new Error('Failed to upload file. Check server logs for details.');
//   }
// }


// /app/actions/upload.ts
'use server';

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { revalidatePath } from 'next/cache';
import { put } from '@vercel/blob';

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
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${file.name}`; // Unique filename

    // Use environment variable to determine storage location
    if (process.env.NODE_ENV === 'development') {
      const uploadDir = join(process.cwd(), 'public', 'uploads');
      await mkdir(uploadDir, { recursive: true });
      const filePath = join(uploadDir, fileName);
      await writeFile(filePath, buffer);
      const url = `/uploads/${fileName}`;
      console.log(`File saved at: ${filePath}, URL: ${url}`);
      return { url };
    } else {
      // Fallback to Vercel Blob for production (e.g., Vercel)
      const blob = await put(fileName, file, { access: 'public' });
      console.log(`File saved to Blob for ${type}: ${blob.url}`);
      return { url: blob.url };
    }
  } catch (err) {
    console.error('Upload error details:', {
      message: err instanceof Error ? err.message : 'Unknown error',
      code: (err instanceof Error && 'code' in err) ? (err as NodeJS.ErrnoException).code : undefined,
      stack: err instanceof Error ? err.stack : undefined,
    });

    // Check for file system errors
    if (err instanceof Error && 'code' in err && (err as NodeJS.ErrnoException).code === 'EROFS' || (err as NodeJS.ErrnoException).code === 'EACCES') {
      const blob = await put(file.name, file, { access: 'public' });
      console.log(`Fallback to Blob due to ${err}: ${blob.url}`);
      return { url: blob.url };
    }
    throw new Error('Failed to upload file. Check server logs for details.');
  }
}