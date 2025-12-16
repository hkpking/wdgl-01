// import 'dotenv/config'; // 不需要，使用 --env-file
// 或者直接读取环境变量
const API_KEY = process.env.DEEPSEEK_API_KEY;

if (!API_KEY) {
    console.error('请设置 DEEPSEEK_API_KEY 环境变量');
    process.exit(1);
}

async function testEmbedding() {
    console.log('正在测试 DeepSeek Embedding API...');

    try {
        const response = await fetch('https://api.deepseek.com/embeddings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat', // 尝试默认模型，或 'text-embedding-3-small'
                input: '测试文本'
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log('✅ 成功!');
            console.log('Model:', data.model);
            console.log('Embedding 维度:', data.data[0].embedding.length);
        } else {
            console.error('❌ 失败:', data);
        }
    } catch (error) {
        console.error('❌ 请求错误:', error.message);
    }
}

testEmbedding();
