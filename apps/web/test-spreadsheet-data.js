// 测试脚本：验证 Supabase 中表格数据
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
    'https://nwyvgeoeqkoupqwjsghk.supabase.co',
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im53eXZnZW9lcWtvdXBxd2pzZ2hrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDkzMDgzNSwiZXhwIjoyMDgwNTA2ODM1fQ.XnHTJabQDyJLdpf3CKZCyQ_3p0ZNQ4_'
);

async function main() {
    const { data, error } = await supabase
        .from('spreadsheets')
        .select('id, title, data, user_id')
        .eq('id', 'b6a9e39a-ef3f-4a4a-8be8-805994b8c9f1')
        .single();

    if (error) {
        console.log('Error:', error);
        return;
    }

    console.log('ID:', data.id);
    console.log('Title:', data.title);
    console.log('User ID:', data.user_id);
    console.log('\nSheet count:', data.data?.length);

    if (data.data?.[0]) {
        const sheet = data.data[0];
        console.log('Sheet name:', sheet.name);
        console.log('Sheet keys:', Object.keys(sheet));
        console.log('Data rows:', sheet.data?.length);
        console.log('Celldata length:', sheet.celldata?.length || 0);

        if (sheet.data?.[0]) {
            console.log('\nFirst row (first 3 cells):', sheet.data[0].slice(0, 3));
        }
    }
}

main();
