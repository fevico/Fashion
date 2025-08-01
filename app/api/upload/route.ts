import { writeFile, mkdir } from 'fs/promises';
import { NextResponse } from 'next/server';
import { join } from 'path';

export async function POST(request: Request) {
  const type = new URL(request.url).searchParams.get('type') as 'avatar' | 'clothing' | null;
  if (!type) {
    return NextResponse.json({ error: 'Type is required' }, { status: 400 });
  }

  const formData = await request.formData();
  const file = formData.get('file') as File | null;

  if (!file) {
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  // Validate file extension
  if (!file.name.endsWith('.glb') && !file.name.endsWith('.gltf')) {
    return NextResponse.json(
      { error: 'Invalid file type. Only .glb and .gltf files are supported.' },
      { status: 400 }
    );
  }

  const uploadDir = join(process.cwd(), 'public', 'uploads', type);
  await mkdir(uploadDir, { recursive: true });

  const filePath = join(uploadDir, file.name);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(filePath, buffer);

  const url = `/uploads/${type}/${file.name}`;
  return NextResponse.json({ url });
}

// import { NextResponse } from 'next/server';
// import { v2 as cloudinary } from 'cloudinary';

// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET,
// });

// export async function POST(request: Request) {
//   const formData = await request.formData();
//   const file = formData.get('file') as File;

//   if (!file) {
//     return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
//   }

//   if (!file.name.endsWith('.glb') && !file.name.endsWith('.gltf')) {
//     return NextResponse.json({ error: 'Only .glb or .gltf files are supported' }, { status: 400 });
//   }
  

//   try {
//     const buffer = await file.arrayBuffer();
//     const uploadResult = await new Promise((resolve, reject) => {
//       cloudinary.uploader.upload_stream(
//         { resource_type: 'raw', upload_preset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET },
//         (error, result) => {
//           if (error) reject(error);
//           else resolve(result);
//         }
//       ).end(Buffer.from(buffer));
//     });

//     return NextResponse.json({ url: uploadResult.secure_url });
//   } catch (err) {
//     console.error('Upload error:', err);
//     return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 });
//   }
// }

// export const config = {
//   api: {
//     bodyParser: false, // Disable default body parsing for file uploads
//   },
// };