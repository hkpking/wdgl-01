
import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://nwyvgeoeqkoupqwjsghk.supabase.co';
// 从环境变量读取 Service Role Key
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
    console.error('❌ 请设置 SUPABASE_SERVICE_ROLE_KEY 环境变量');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: { persistSession: false }
});


async function checkDocumentVectorization() {
    console.log(`🔎 正在获取最近更新的文档列表...`);

    // 查找最近的 20 个文档
    const { data: docs, error: docError } = await supabase
        .from('documents')
        .select('id, title, updated_at')
        .order('updated_at', { ascending: false })
        .limit(20);

    if (docError) {
        console.error('❌ 查询文档失败:', docError.message);
        return;
    }

    if (!docs || docs.length === 0) {
        console.log('⚠️ 数据库中没有任何文档。');
        return;
    }

    console.log(`✅ 最近 ${docs.length} 个文档状态:`);

    for (const doc of docs) {
        // 查询 Embeddings
        const { count, error: embError } = await supabase
            .from('document_embeddings')
            .select('*', { count: 'exact', head: true })
            .eq('document_id', doc.id);

        const status = count > 0 ? '✅ 已向量化' : '❌ 未向量化';
        console.log(`[${status}] 📄 "${doc.title || '无标题'}" (ID: ${doc.id}) - ${count} chunks`);
    }
}

checkDocumentVectorization();

