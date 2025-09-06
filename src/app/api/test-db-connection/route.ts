import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ error: 'Database removed' }, { status: 410 });
}
