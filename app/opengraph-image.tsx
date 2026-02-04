import { ImageResponse } from 'next/og';

// Route segment config (using default Node/Serverless runtime)


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
            <div
                style={{
                    background: '#09090b',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'sans-serif',
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
                        <rect width="32" height="32" rx="7" fill="#10b981" />
                        <g transform="translate(4,4)">
                            <path
                                d="M12 2C7.58172 2 4 5.58172 4 10C4 14.4183 12 22 12 22C12 22 20 14.4183 20 10C20 5.58172 16.4183 2 12 2Z"
                                stroke="white"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <circle cx="12" cy="10" r="3" fill="#064e3b" />
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
                        Find halal restaurants near you
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
        }
    );
}
