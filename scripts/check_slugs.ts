
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSlugs() {
    const { count, error } = await supabase
        .from('halal_restaurants')
        .select('*', { count: 'exact', head: true });

    if (error) {
        console.error("Error fetching count:", error);
        return;
    }

    const { count: nullSlugs, error: error2 } = await supabase
        .from('halal_restaurants')
        .select('*', { count: 'exact', head: true })
        .is('slug', null);

    if (error2) {
        console.error("Error fetching null slugs:", error2);
        return;
    }

    console.log(`Total Restaurants: ${count}`);
    console.log(`Restaurants with NULL slug: ${nullSlugs}`);
    console.log(`Fallback usage likelihood: ${((nullSlugs || 0) / (count || 1) * 100).toFixed(1)}%`);
}

checkSlugs();
