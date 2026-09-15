export type CityBounds = {
    latMin: number;
    latMax: number;
    lngMin: number;
    lngMax: number;
};

export type CityData = {
    name: string;
    // Address-based cities match `address ILIKE %filter%`.
    filter?: string;
    // Neighborhood-level pages (no reliable city name in the address) match by lat/lng box instead.
    bounds?: CityBounds;
};

export const CITIES: Record<string, CityData> = {
    vancouver: { name: 'Vancouver', filter: 'Vancouver' },
    surrey: { name: 'Surrey', filter: 'Surrey' },
    burnaby: { name: 'Burnaby', filter: 'Burnaby' },
    richmond: { name: 'Richmond', filter: 'Richmond' },
    coquitlam: { name: 'Coquitlam', filter: 'Coquitlam' },
    langley: { name: 'Langley', filter: 'Langley' },
    delta: { name: 'Delta', filter: 'Delta' },
    abbotsford: { name: 'Abbotsford', filter: 'Abbotsford' },
    'north-vancouver': { name: 'North Vancouver', filter: 'North Vancouver' },
    'new-westminster': { name: 'New Westminster', filter: 'New Westminster' },
    'port-coquitlam': { name: 'Port Coquitlam', filter: 'Port Coquitlam' },
    'white-rock': { name: 'White Rock', filter: 'White Rock' },
    victoria: { name: 'Victoria', filter: 'Victoria' },
    // Downtown peninsula (West End, Yaletown, Gastown, Chinatown, Coal Harbour) —
    // addresses don't contain "Downtown", so this filters by coordinates instead.
    'downtown-vancouver': {
        name: 'Downtown Vancouver',
        bounds: { latMin: 49.271, latMax: 49.291, lngMin: -123.142, lngMax: -123.100 },
    },
};

export type CityKey = keyof typeof CITIES;
