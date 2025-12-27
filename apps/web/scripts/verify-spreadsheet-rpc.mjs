import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nwyvgeoeqkoupqwjsghk.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
});

async function verifySearch() {
    console.log('=== Verifying match_spreadsheets RPC ===');

    // Create a dummy embedding (384 dimensions for all-MiniLM-L6-v2)
    const dummyEmbedding = new Array(384).fill(0.01);

    try {
        console.log('Calling match_spreadsheets...');
        const { data, error } = await supabase.rpc('match_spreadsheets', {
            query_embedding: JSON.stringify(dummyEmbedding),
            match_threshold: 0.0,
            match_count: 5,
            p_user_id: null
        });

        if (error) {
            console.error('❌ RPC Call Failed:', error);
            console.error('Reason: The database migration might not have been applied correctly.');
            process.exit(1);
        } else {
            console.log('✅ RPC Call Successful!');
            console.log(`Returned ${data.length} results.`);
            if (data.length > 0) {
                console.log('Sample result:', data[0]);
            } else {
                console.log('No results found (this is normal if no spreadsheets are vectorized yet).');
            }
        }
    } catch (e) {
        console.error('❌ Unexpected error:', e);
        process.exit(1);
    }
}

verifySearch();
