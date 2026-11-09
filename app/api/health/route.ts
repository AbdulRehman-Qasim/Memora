import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json(
    { status: 'UP', message: 'API is running' },
    { status: 200 }
  );
}

