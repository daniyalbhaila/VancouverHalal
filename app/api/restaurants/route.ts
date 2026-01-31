import { getDiscoveryRestaurants } from '@/lib/data';
import { NextResponse } from 'next/server';

export async function GET() {
    const data = await getDiscoveryRestaurants();
    return NextResponse.json(data);
}
