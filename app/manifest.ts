import { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'Halal Maps - Vancouver',
        short_name: 'Halal Maps',
        description: 'The ultimate guide to the best Halal food in Vancouver, BC.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#ffffff',
        icons: [
            {
                src: '/favicon.svg',
                sizes: 'any',
                type: 'image/svg+xml',
            },
            {
                src: '/api/icons/192',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/api/icons/256',
                sizes: '256x256',
                type: 'image/png',
            },
            {
                src: '/api/icons/512',
                sizes: '512x512',
                type: 'image/png',
            },
            {
                src: '/apple-icon', // Uses the standard Next.js generated route
                sizes: '180x180',
                type: 'image/png',
            }
        ],
    }
}
