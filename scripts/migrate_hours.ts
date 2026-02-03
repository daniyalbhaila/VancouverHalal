
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Missing environment variables.');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function main() {
    console.log('🚀 Starting Opening Hours Standardization Migration...');

    // 1. Fetch all restaurants with google_data
    const { data: restaurants, error } = await supabase
        .from('halal_restaurants')
        .select('id, name, google_data')
        .not('google_data', 'is', null);

    if (error) {
        console.error('Error fetching restaurants:', error);
        return;
    }

    console.log(`Found ${restaurants.length} restaurants with google data.`);

    let updatedCount = 0;

    for (const r of restaurants) {
        const googleData = r.google_data as any; // Raw Apify data

        if (googleData && googleData.openingHours) {

            // Transform Apify Format -> Standard Format
            // Apify: [{ day: "Monday", hours: "10am-10pm" }]

            const apifyHours = googleData.openingHours;
            const openNow = googleData.openingStatus === 'OPEN'; // simplistic check

            // 1. Generate standard weekday_text strings
            const weekdayText = Array.isArray(apifyHours)
                ? apifyHours.map((h: any) => {
                    if (h.day && h.hours) return `${h.day}: ${h.hours}`;
                    return null;
                }).filter(Boolean)
                : [];

            // 2. Parser Helper for Periods
            function parseToPeriods(rawHoursArray: any[]) {
                const periods: any[] = [];
                const dayMap: Record<string, number> = { "Sunday": 0, "Monday": 1, "Tuesday": 2, "Wednesday": 3, "Thursday": 4, "Friday": 5, "Saturday": 6 };

                for (const item of rawHoursArray) {
                    if (!item.day || !item.hours) continue;
                    const dayIdx = dayMap[item.day];
                    if (dayIdx === undefined) continue;

                    if (item.hours.toLowerCase().includes('closed')) continue;
                    if (item.hours.toLowerCase().includes('24 hours')) {
                        periods.push({ open: { day: dayIdx, time: "0000" } }); // Google format for 24h can be specific, but open usually enough? 
                        // Actually Google uses: open: { day: 0, time: '0000' } and no close if 24h? Or close next day? 
                        // Standard is usually just open.
                        continue;
                    }

                    // Parse "11:00 AM - 10:00 PM" OR "11 AM to 10 PM"
                    // Handle "to", "-", "–" separators
                    const parts = item.hours.split(/to|-|–|—/).map((s: string) => s.trim());
                    if (parts.length !== 2) continue;
                    const [startStr, endStr] = parts;

                    const parseTimeStr = (t: string) => {
                        // Clean string: replace non-breaking spaces, trim
                        t = t.replace(/[\u200B-\u200D\uFEFF\u202F]/g, ' ').trim();

                        // Regex to match: 11, 11:30, 11 AM, 11:30 PM
                        // Groups: 1=Hours, 2=Minutes(optional), 3=Modifier
                        const match = t.match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
                        if (!match) throw new Error(`Invalid format: ${t}`);

                        let [_, hStr, mStr, mod] = match;
                        let h = parseInt(hStr);
                        let m = mStr ? parseInt(mStr) : 0;

                        mod = mod.toUpperCase();

                        if (mod === 'PM' && h !== 12) h += 12;
                        if (mod === 'AM' && h === 12) h = 0;

                        return h.toString().padStart(2, '0') + m.toString().padStart(2, '0');
                    };

                    try {
                        const openTime = parseTimeStr(startStr);
                        let closeTime = parseTimeStr(endStr);

                        // Handle next day close
                        let closeDay = dayIdx;
                        // If close time is "earlier" than open time (e.g. 1100 open, 0200 close), assuming closing next day.
                        // Or if close time < open time.
                        if (parseInt(closeTime) < parseInt(openTime)) {
                            closeDay = (dayIdx + 1) % 7;
                        }

                        periods.push({
                            open: { day: dayIdx, time: openTime },
                            close: { day: closeDay, time: closeTime }
                        });
                    } catch (e) {
                        // parse error, skip period
                    }
                }
                return periods;
            }

            const periods = parseToPeriods(apifyHours);

            // 3. Create the Standard JSON Object
            // We store BOTH specific weekday_text (for Display) and structured periods/apify (for Logic)
            const standardizedHours = {
                weekday_text: weekdayText, // Used by HoursDisplay.tsx
                periods: periods,         // Google Standard Logic
                structured: apifyHours,   // Backup
                source: "apify_migration_v2"
            };

            // Update DB
            const { error: updateError } = await supabase
                .from('halal_restaurants')
                .update({ opening_hours: JSON.stringify(standardizedHours) })
                .eq('id', r.id);

            if (updateError) {
                console.error(`❌ Failed to update ${r.name}:`, updateError);
            } else {
                updatedCount++;
                if (updatedCount % 50 === 0) process.stdout.write('.');
            }
        }
    }

    console.log(`\n✅ Migration Complete. Updated ${updatedCount} restaurants.`);
}

main().catch(console.error);
