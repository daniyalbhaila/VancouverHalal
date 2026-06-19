import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/swipe', '/saved', '/report', '/suggest'],
            },
            { userAgent: 'GPTBot', allow: '/' },
            { userAgent: 'PerplexityBot', allow: '/' },
            { userAgent: 'ClaudeBot', allow: '/' },
            { userAgent: 'Google-Extended', allow: '/' },
            { userAgent: 'anthropic-ai', allow: '/' },
        ],
        sitemap: 'https://halalmaps.app/sitemap.xml',
    };
}
