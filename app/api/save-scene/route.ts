import { writeFile } from 'fs/promises';
import { join } from 'path';
import { NextResponse } from 'next/server';

interface SceneState {
  avatarUrl: string | null;
  clothingUrl: string | null;
  showClothing: boolean;
}

export async function POST(request: Request) {
  const sceneState: SceneState = await request.json();
  const filePath = join(process.cwd(), 'scene-state.json');

  try {
    await writeFile(filePath, JSON.stringify(sceneState, null, 2));
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Error saving scene state:', err);
    return NextResponse.json({ error: 'Failed to save scene' }, { status: 500 });
  }
}