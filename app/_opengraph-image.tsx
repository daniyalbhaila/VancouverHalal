import { ImageResponse } from 'next/og';

// Route segment config
export const runtime = 'edge';

// Image metadata
export const alt = 'Halal Maps - Vancouver\'s Top Rated Dining Guide';
export const size = {
    width: 1200,
    height: 630,
};

export const contentType = 'image/png';

export default async function Image() {
    // Font loading with fallback
    let fonts: { name: string; data: ArrayBuffer; style: 'normal'; weight: 700 }[] | undefined;
    let fontFamily = 'sans-serif';

    try {
        const manropeBold = await fetch(
            new URL('https://fonts.gstatic.com/s/manrope/v14/xn7_YHE41ni1AdIRqAuZuw1Bx9mbZk79FN_C-bw.woff2', import.meta.url)
        ).then((res) => {
            if (!res.ok) throw new Error('Failed to load font');
            return res.arrayBuffer();
        });

        fonts = [
            {
                name: 'Manrope',
                data: manropeBold,
                style: 'normal',
                weight: 700,
            },
        ];
        fontFamily = 'Manrope';
    } catch (e) {
        console.error('Failed to load OG font, falling back to system font', e);
        // Continue without custom font to ensure image serves (200 OK) instead of 500
    }

    return new ImageResponse(
        (
            <div
                style={{
                    background: '#09090b',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: fontFamily,
                }}
            >
                {/* Background Gradient Effect */}
                <div
                    style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'radial-gradient(circle at 50% 0%, #10b98120 0%, transparent 50%)',
                    }}
                />

                {/* Logo Section */}
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 40,
                    }}
                >
                    <svg
                        width="120"
                        height="120"
                        viewBox="0 0 32 32"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <defs>
                            <linearGradient id="paint0_linear" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                                <stop stopColor="#34D399" />
                                <stop offset="1" stopColor="#059669" />
                            </linearGradient>
                        </defs>
                        <rect width="32" height="32" rx="7" fill="url(#paint0_linear)" />
                        <g transform="translate(4,4)">
                            <path
                                d="M12 2C7.58172 2 4 5.58172 4 10C4 14.4183 12 22 12 22C12 22 20 14.4183 20 10C20 5.58172 16.4183 2 12 2Z"
                                stroke="white"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                fill="white"
                            />
                            <circle cx="12" cy="10" r="3" fill="#047857" />
                        </g>
                    </svg>
                </div>

                {/* Text Content */}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        textAlign: 'center',
                    }}
                >
                    <div
                        style={{
                            fontSize: 84,
                            fontWeight: 900,
                            color: 'white',
                            marginBottom: 20,
                            letterSpacing: '-0.05em',
                            display: 'flex',
                            alignItems: 'center',
                        }}
                    >
                        Halal Maps
                    </div>
                    <div
                        style={{
                            fontSize: 36,
                            color: '#a1a1aa', // zinc-400
                            fontWeight: 500,
                        }}
                    >
                        Discover 50+ Top Rated Restaurants
                    </div>
                </div>

                {/* Bottom Accent */}
                <div
                    style={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: 8,
                        background: 'linear-gradient(90deg, #059669 0%, #34d399 100%)',
                    }}
                />
            </div>
        ),
        {
            ...size,
            fonts: fonts,
        }
    );
}
