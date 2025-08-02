
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const formData = await request.formData(); 
  const file = formData.get('file') as File;   
  
  if (!file) { 
    return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
  }

  if (!file.name.endsWith('.glb') && !file.name.endsWith('.gltf')) {
    return NextResponse.json({ error: 'Only .glb or .gltf files are supported' }, { status: 400 });
  }   

  const maxSize = 4.5 * 1024 * 1024; // 4.5 MB
  if (file.size > maxSize) {
    return NextResponse.json({ error: `File size exceeds 4.5 MB limit (${(file.size / 1024 / 1024).toFixed(2)} MB)` }, { status: 413 });
  }

  try {
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const fileName = `${Date.now()}-${file.name}`; // Unique filename
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true }); // Attempt to create directory

    // Check if we can write to public directory (will fail on Vercel)
    const filePath = join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    const url = `/uploads/${fileName}`; // Relative to public directory
    console.log(`File saved at: ${filePath}, URL: ${url}`);
    return NextResponse.json({ url });
  } catch (err) {
    console.error('Upload error details:', err);
    return NextResponse.json({ error: 'Failed to upload file. Check server logs for details.' }, { status: 500 });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};

