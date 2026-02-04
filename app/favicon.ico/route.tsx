import { IconGenerator } from '@/lib/icon-generator';

export const runtime = 'edge';

export async function GET() {
    // Return a 32x32 PNG which works as a favicon.ico in modern browsers
    // Note: While this isn't a true .ico format, most browsers accept PNGsserved at /favicon.ico
    return IconGenerator(32);
}
