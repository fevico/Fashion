import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { NextResponse } from 'next/server';

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