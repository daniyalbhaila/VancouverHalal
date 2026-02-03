
import { createClient } from '@supabase/supabase-js'
import fs from 'fs'
import path from 'path'

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

async function testWrite() {
    console.log("Attempting to insert dummy row...");
    // We'll try to update the one row we found earlier, or insert a clearly fake one
    // Using a fake ID to avoid collision
    const testRow = {
        name: "Test Write Permission",
        slug: "test-write-permission",
        // Using minimal fields
    };

    const { data, error } = await supabase
        .from('halal_restaurants')
        .insert([testRow])
        .select();

    if (error) {
        console.error("Write Failed:", error);
    } else {
        console.log("Write Successful:", data);
        // Clean up
        await supabase.from('halal_restaurants').delete().eq('slug', 'test-write-permission');
    }
}

testWrite();
