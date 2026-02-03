
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) { console.error('Missing env vars'); process.exit(1); }

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
    const { data, error } = await supabase
        .from('halal_restaurants')
        .select('name, opening_hours')
        .not('opening_hours', 'is', null)
        .limit(3);

    if (error) { console.error(error); return; }

    console.log('--- Sample Data Verification ---');
    for (const r of data) {
        console.log(`\nName: ${r.name}`);
        const hours = typeof r.opening_hours === 'string' ? JSON.parse(r.opening_hours) : r.opening_hours;

        console.log('Has weekday_text?', !!hours.weekday_text);
        if (hours.weekday_text) console.log('Sample:', hours.weekday_text[0]);

        console.log('Has periods?', !!hours.periods);
        if (hours.periods && hours.periods.length > 0) {
            console.log('Sample Period:', hours.periods[0]);
        } else {
            console.log('Periods: EMPTY/NULL');
        }
    }
}

main();
