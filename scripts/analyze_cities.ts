import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Manually read .env.local
const envPath = path.resolve(__dirname, '../.env.local');
if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim().replace(/^['"](.*)['"]$/, '$1');
            process.env[key] = value;
        }
    });
}

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
)

async function analyzeCities() {
    console.log("Fetching all addresses...");
    const { data, error } = await supabase
        .from('halal_restaurants')
        .select('address')
        .not('address', 'is', null);

    if (error) {
        console.error(error);
        return;
    }

    const cityCounts: Record<string, number> = {};

    data?.forEach(row => {
        if (!row.address) return;
        // Simple heuristic: look for city part. 
        // Addresses usually: "123 St, City, State ZIP" or "123 St, City, State"
        // Let's try to grab the part before ", BC" or just look for known cities.
        const knownCities = [
            'Vancouver', 'Burnaby', 'Surrey', 'Richmond', 'Coquitlam',
            'North Vancouver', 'West Vancouver', 'Delta', 'New Westminster',
            'Langley', 'Abbotsford', 'Port Moody', 'Port Coquitlam', 'White Rock'
        ];

        let found = false;
        for (const city of knownCities) {
            if (row.address.includes(city)) { // Case sensitive often works, but maybe regex better?
                // Let's rely on string inclusion for now
                cityCounts[city] = (cityCounts[city] || 0) + 1;
                found = true;
            }
        }
        if (!found) {
            // console.log("Could not identify city for:", row.address);
        }
    });

    console.log("\nCity Counts:");
    const sorted = Object.entries(cityCounts).sort((a, b) => b[1] - a[1]);
    sorted.forEach(([city, count]) => {
        console.log(`${city}: ${count}`);
    });
}

analyzeCities();
