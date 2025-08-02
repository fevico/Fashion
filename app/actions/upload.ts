
'use server';

import { v2 as cloudinary } from 'cloudinary';
import { UploadApiResponse } from 'cloudinary'; // Import the response type

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const result = await new Promise<UploadApiResponse>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { 
          upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_PRESET_NAME,
          resource_type: 'raw', // For non-image files like .glb/.gltf
          folder: `fashion-self/${type}`, // Organize by type
        },
        (error, result) => {
          if (error || !result) {
            reject(error || new Error('Upload result is undefined'));
            return;
          }
          resolve(result);
        }
      ).end(buffer);
    });

    console.log(`File uploaded to Cloudinary for ${type}: ${result.secure_url}`);
    return { url: result.secure_url };
  } catch (err) {
    console.error('Upload error details:', {
      message: err instanceof Error ? err.message : 'Unknown error',
      stack: err instanceof Error ? err.stack : undefined,
    });
    throw new Error('Failed to upload file. Check server logs for details.');
  }
}