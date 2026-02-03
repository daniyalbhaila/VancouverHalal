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
    return new ImageResponse(
        (
            // ImageResponse JSX element
            <div
                style={{
                    background: 'linear-gradient(to bottom right, #09090b, #18181b)',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'sans-serif',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 24,
                        padding: '40px 80px',
                        background: 'rgba(255,255,255,0.03)',
                        boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
                    }}
                >
                    <div
                        style={{
                            fontSize: 84,
                            fontWeight: 900,
                            color: 'white',
                            marginBottom: 20,
                            letterSpacing: '-0.05em',
                        }}
                    >
                        Halal Maps
                    </div>
                    <div
                        style={{
                            fontSize: 32,
                            color: '#10b981', // emerald-500
                            fontWeight: 600,
                        }}
                    >
                        Vancouver&apos;s Top Rated Dining Guide
                    </div>
                </div>

                {/* Decorative Elements */}
                <div
                    style={{
                        position: 'absolute',
                        top: -100,
                        left: -100,
                        width: 400,
                        height: 400,
                        background: '#10b981',
                        filter: 'blur(200px)',
                        opacity: 0.2,
                        borderRadius: '50%',
                    }}
                />
                <div
                    style={{
                        position: 'absolute',
                        bottom: -100,
                        right: -100,
                        width: 400,
                        height: 400,
                        background: '#34d399',
                        filter: 'blur(200px)',
                        opacity: 0.2,
                        borderRadius: '50%',
                    }}
                />
            </div>
        ),
        // ImageResponse options
        {
            ...size,
        }
    );
}
