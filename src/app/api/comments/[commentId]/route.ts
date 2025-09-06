import { NextResponse } from 'next/server';

// Comments feature removed
export async function PUT() {
  return NextResponse.json({ error: 'Comments feature removed' }, { status: 410 });
}

export async function DELETE() {
  return NextResponse.json({ error: 'Comments feature removed' }, { status: 410 });
}
