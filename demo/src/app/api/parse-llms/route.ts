import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parseLLMs } from '@/libs/llmsParser';

export async function GET() {
  try {
    const llmsPath = path.join(process.cwd(), 'LLMs.txt');
    const content = fs.readFileSync(llmsPath, 'utf8');
    const data = parseLLMs(content);
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'LLMs.txt の読み込みに失敗しました' }, { status: 500 });
  }
}
