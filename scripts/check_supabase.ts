
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

// Manually read .env.local
const envPath = path.resolve(__dirname, '../.env.local');
console.log(`Reading env from: ${envPath}`);

if (fs.existsSync(envPath)) {
    const envConfig = fs.readFileSync(envPath, 'utf8');
    envConfig.split('\n').forEach(line => {
        const match = line.match(/^([^=]+)=(.*)$/);
        if (match) {
            const key = match[1].trim();
            const value = match[2].trim().replace(/^['"](.*)['"]$/, '$1'); // Remove quotes
            process.env[key] = value;
        }
    });
}

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    console.error('Error: SUPABASE_URL or SUPABASE_ANON_KEY not found in .env.local (Checked for both prefixed and non-prefixed versions)')
    console.log('Available Env Keys:', Object.keys(process.env).filter(k => k.includes('SUPABASE')));
    process.exit(1)
}

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
)

async function checkData() {
    console.log("Fetching one restaurant from 'halal_restaurants'...");

    const { data, error } = await supabase
        .from('halal_restaurants')
        .select('*')
        .limit(1);

    if (error) {
        console.error('Error fetching data:', error);
        return;
    }

    if (!data || data.length === 0) {
        console.log("No data found in 'halal_restaurants' table.");
        return;
    }

    const r = data[0];
    console.log("\nSample Restaurant Data:");
    console.log("Name:", r.name);
    console.log("Image URL:", r.image_url);
    console.log("Categories:", r.categories);
    console.log("Rating:", r.rating);
    console.log("Reviews:", r.reviews_count); // Supabase view likely uses snake_case
    console.log("Amenities/Info (raw):", r.amenities || "N/A (field might be missing)");

    // Check if other fields we saw in JSON exist here
    const keys = Object.keys(r);
    console.log("\nAll Available Columns:", keys.join(", "));
}

checkData();
