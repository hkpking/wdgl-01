
const { createClient } = require('@supabase/supabase-js');

// Load env vars provided via command line or defaults
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://nwyvgeoeqkoupqwjsghk.supabase.co';
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_KEY) {
    console.error('Error: SUPABASE_SERVICE_ROLE_KEY is required');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function checkEmbeddings() {
    console.log('Checking document_embeddings table...');

    const { data, error } = await supabase
        .from('document_embeddings')
        .select('id, document_id, created_at, chunk_text, embedding')
        .order('created_at', { ascending: false })
        .limit(5);

    if (error) {
        console.error('Error fetching embeddings:', error);
        return;
    }

    if (!data || data.length === 0) {
        console.log('No embeddings found.');
        return;
    }

    console.log(`Found ${data.length} recent embeddings:`);
    data.forEach((row, i) => {
        const embedding = typeof row.embedding === 'string' ? JSON.parse(row.embedding) : row.embedding;
        const dim = Array.isArray(embedding) ? embedding.length : 'unknown';
        console.log(`[${i}] ID: ${row.id}, DocID: ${row.document_id}, Created: ${row.created_at}, Dim: ${dim}`);
        console.log(`    Preview: ${row.chunk_text.substring(0, 50)}...`);
    });
}

checkEmbeddings();
