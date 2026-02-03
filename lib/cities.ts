export const CITIES = {
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
};

export type CityKey = keyof typeof CITIES;
