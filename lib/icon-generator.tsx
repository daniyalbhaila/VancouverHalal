import { ImageResponse } from 'next/og';

export function IconGenerator(size: number) {
    return new ImageResponse(
        (
            <div
                style={{
                    background: 'linear-gradient(135deg, #34d399 0%, #059669 100%)', // emerald-400 to emerald-700
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: '22%', // Squircle-like shape
                }}
            >
                {/* Vector Map Pin - Scaled based on size */}
                <svg
                    width={Math.floor(size * 0.625)} // 20 for 32, 120 for 192
                    height={Math.floor(size * 0.625)}
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M12 2C7.58172 2 4 5.58172 4 10C4 14.4183 12 22 12 22C12 22 20 14.4183 20 10C20 5.58172 16.4183 2 12 2Z"
                        stroke="white"
                        strokeWidth={size <= 48 ? 3 : 2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="white" // Added fill to match Apple icon style
                    />
                    <circle cx="12" cy="10" r="3" fill="#047857" />
                </svg>
            </div>
        ),
        {
            width: size,
            height: size,
        }
    );
}
