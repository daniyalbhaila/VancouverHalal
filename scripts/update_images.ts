
import { createClient } from '@supabase/supabase-js';
import { ApifyClient } from 'apify-client';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables
dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY; // Try both common names
const APIFY_TOKEN = process.env.APIFY_TOKEN;

if (!SUPABASE_URL || !SUPABASE_KEY || !APIFY_TOKEN) {
    console.error('❌ Missing environment variables.');
    console.error(`   - NEXT_PUBLIC_SUPABASE_URL: ${!!SUPABASE_URL}`);
    console.error(`   - SUPABASE_SERVICE_ROLE_KEY: ${!!SUPABASE_KEY}`);
    console.error(`   - APIFY_TOKEN: ${!!APIFY_TOKEN}`);
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
const apify = new ApifyClient({ token: APIFY_TOKEN });

async function main() {
    console.log('🚀 Starting image update script...');

    const { data: restaurants, error } = await supabase
        .from('halal_restaurants')
        .select('id, name, place_id')
        .not('place_id', 'is', null)
        .is('google_data', null); // Only fetch those we missed

    if (error) {
        console.error('❌ Error fetching restaurants:', error);
        return;
    }

    if (!restaurants || restaurants.length === 0) {
        console.log('✅ No restaurants found to update.');
        return;
    }

    console.log(`📦 Found ${restaurants.length} restaurants to sync.`);

    // 2. Prepare Apify Start URLs
    const startUrls = restaurants.map(r => ({
        url: `https://www.google.com/maps/search/?api=1&query=Google&query_place_id=${r.place_id}`
    }));

    console.log('🕷️  Starting Apify scraper (compass/crawler-google-places)...');

    // 3. Run the Actor
    const run = await apify.actor('compass/crawler-google-places').call({
        startUrls: startUrls,
        maxImages: 10,
        maxReviews: 10,
        language: 'en',
        maxCrawledPlacesPerSearch: 1,
        forceEng: true
    });

    console.log(`✅ Scrape finished! Run ID: ${run.defaultDatasetId}`);
    console.log('💾 Fetching results and updating database...');

    // 4. Fetch Results
    const { items } = await apify.dataset(run.defaultDatasetId).listItems();

    // 5. Update Supabase
    let updatedCount = 0;
    for (const item of items as any[]) {
        const imageUrl = item.imageUrls?.[0]; // Get the first image

        // Match back to our restaurant record
        const placeId = item.placeId;

        if (placeId) {
            const updates: any = {};

            // Save EVERYTHING for later in the new JSONB column
            updates.google_data = item;

            // Map standard fields
            if (imageUrl) updates.image_url = imageUrl;
            if (item.totalScore) updates.rating = item.totalScore;
            if (item.reviewsCount) updates.reviews_count = item.reviewsCount;
            if (item.price) updates.price = item.price;
            if (item.price) updates.price = item.price;

            // Generate Structured Hours
            let openingHoursJSON = null;
            if (item.openingHours) {
                const arr = item.openingHours as any[];

                // 1. Weekday Text
                const weekdayText = arr.map((h: any) => h.day && h.hours ? `${h.day}: ${h.hours}` : null).filter(Boolean);

                // 2. Periods
                const periods: any[] = [];
                const dayMap: Record<string, number> = { "Sunday": 0, "Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4, "Friday": 5, "Saturday": 6 };

                for (const h of arr) {
                    if (!h.day || !h.hours || h.hours.toLowerCase().includes('closed')) continue;
                    const dIdx = dayMap[h.day];
                    if (dIdx === undefined) continue;

                    if (h.hours.toLowerCase().includes('24 hours')) {
                        periods.push({ open: { day: dIdx, time: "0000" } });
                        continue;
                    }

                    // Parse "11:00 AM - 10:00 PM" OR "11 AM to 10 PM"
                    const parts = h.hours.split(/to|-|–|—/).map((s: string) => s.trim());
                    if (parts.length !== 2) continue;
                    const [startStr, endStr] = parts;

                    const parseTimeStr = (t: string) => {
                        t = t.replace(/[\u200B-\u200D\uFEFF\u202F]/g, ' ').trim();
                        const match = t.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
                        if (!match) throw new Error(); // Silent fail in loop

                        let [_, hStr, mStr, mod] = match;
                        let hh = parseInt(hStr);
                        let mm = mStr ? parseInt(mStr) : 0;

                        mod = mod.toUpperCase();
                        if (mod === 'PM' && hh !== 12) hh += 12;
                        if (mod === 'AM' && hh === 12) hh = 0;
                        return hh.toString().padStart(2, '0') + mm.toString().padStart(2, '0');
                    };

                    try {
                        const openTime = parseTimeStr(startStr);
                        const closeTime = parseTimeStr(endStr);
                        let closeDay = dIdx;
                        if (parseInt(closeTime) < parseInt(openTime)) closeDay = (dIdx + 1) % 7;

                        periods.push({ open: { day: dIdx, time: openTime }, close: { day: closeDay, time: closeTime } });
                    } catch { }
                }

                openingHoursJSON = {
                    weekday_text: weekdayText,
                    periods: periods,
                    source: "scraper_v2"
                };
            }

            if (openingHoursJSON) updates.opening_hours = JSON.stringify(openingHoursJSON);
            else if (item.openingHours) updates.opening_hours = item.openingHours; // Fallback

            if (item.website) updates.website = item.website;
            if (item.website) updates.website = item.website;
            if (item.phone) updates.phone = item.phone;
            if (item.url) updates.google_url = item.url;

            const { error: updateError } = await supabase
                .from('halal_restaurants')
                .update(updates)
                .eq('place_id', placeId);

            if (updateError) {
                console.error(`❌ Failed to update ${placeId}:`, updateError);
            } else {
                console.log(`✨ Updated: ${item.title || placeId}`);
                console.log(`   - Fields: ${Object.keys(updates).join(', ')}`);
                updatedCount++;
            }
        }
    }

    console.log(`\n🎉 Done! Updated ${updatedCount} restaurants.`);
}

main().catch(console.error);
