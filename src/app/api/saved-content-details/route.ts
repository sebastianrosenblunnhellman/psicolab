import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ error: 'Feature removed' }, { status: 410 });
}