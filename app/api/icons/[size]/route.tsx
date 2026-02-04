import { NextRequest } from 'next/server';
import { IconGenerator } from '@/lib/icon-generator';

export const runtime = 'edge';

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ size: string }> } // params is a Promise in Next.js 15+
) {
    const { size } = await context.params;
    const sizeNumber = parseInt(size, 10);

    if (isNaN(sizeNumber) || sizeNumber < 16 || sizeNumber > 1024) {
        return new Response('Invalid size', { status: 400 });
    }

    return IconGenerator(sizeNumber);
}
