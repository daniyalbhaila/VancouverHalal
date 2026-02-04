import { IconGenerator } from '@/lib/icon-generator';

// Route segment config


// Image metadata
export function generateImageMetadata() {
    return [
        {
            contentType: 'image/png',
            size: { width: 32, height: 32 },
            id: '32',
        },
    ]
}

// Image generation
export default function Icon({ id }: { id: string }) {
    // Default to 32x32 if id is missing
    const size = parseInt(id) || 32;
    return IconGenerator(size);
}
