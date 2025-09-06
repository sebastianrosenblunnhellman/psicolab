import { NextResponse } from 'next/server';

// Comments API disabled
export async function GET() {
  return NextResponse.json({ error: 'Comments feature removed' }, { status: 410 });
}

export async function POST() {
  return NextResponse.json({ error: 'Comments feature removed' }, { status: 410 });
}
