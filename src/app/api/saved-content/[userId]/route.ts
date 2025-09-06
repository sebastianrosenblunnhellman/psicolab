import { NextResponse } from 'next/server';

// Saved content feature removed
export async function GET() { return NextResponse.json({ error: 'Feature removed' }, { status: 410 }); }
export async function POST() { return NextResponse.json({ error: 'Feature removed' }, { status: 410 }); }
export async function DELETE() { return NextResponse.json({ error: 'Feature removed' }, { status: 410 }); }