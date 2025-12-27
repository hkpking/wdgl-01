const API_KEY = process.env.DEEPSEEK_API_KEY;

async function testEmbedding() {
    console.log('正在测试 DeepSeek Embedding API (调试模式)...');

    // 尝试不同的端点和模型
    const configurations = [
        { url: 'https://api.deepseek.com/extract/embeddings', model: 'text-embedding-3-small' }, // 猜测的端点
        { url: 'https://api.deepseek.com/v1/embeddings', model: 'deepseek-chat' },
        { url: 'https://api.deepseek.com/embeddings', model: '' }
    ];

    try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [{ role: 'user', content: 'test' }],
                max_tokens: 1
            })
        });

        console.log('Chat API status:', response.status); // 确认 API Key 有效性

        // 只有 Chat API 是确定的，Embedding API 在 DeepSeek 官方文档中并不明确支持
        // 实际上，DeepSeek 官方目前主要提供 Chat 模型，Embedding 通常建议搭配外部服务

    } catch (error) {
        console.error('Error:', error);
    }
}

testEmbedding();
