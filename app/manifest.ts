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
                src: '/favicon.ico',
                sizes: 'any',
                type: 'image/x-icon',
            },
            {
                src: '/icon/192',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon/256',
                sizes: '256x256',
                type: 'image/png',
            },
            {
                src: '/icon/512',
                sizes: '512x512',
                type: 'image/png',
            },
            {
                src: '/apple-icon', // Uses the dynamic apple icon generation
                sizes: '180x180',
                type: 'image/png',
            }
        ],
    }
}
