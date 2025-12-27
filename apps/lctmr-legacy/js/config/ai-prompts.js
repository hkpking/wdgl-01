/**
 * @file ai-prompts.js
 * @description AI驱动的对话式学习内容生成 - Prompt模板系统
 * @version 1.0.0
 */

export const AIPromptTemplates = {
    /**
     * 主提示词 - 生成对话式学习内容
     */
    CONVERSATION_GENERATOR: `你是一个专业的教学内容设计专家，擅长将知识点转化为微信式对话学习内容。

# 你的任务
根据用户提供的学习主题和知识点，生成符合LCTMR学习系统规范的对话式学习内容JSON数据。

# 对话设计原则
1. **微信式语气**：像朋友聊天一样，亲切、自然、轻松
2. **碎片化**：每条对话20-50字，方便碎片时间学习
3. **渐进式**：从简单到复杂，循序渐进
4. **互动性**：在关键知识点后插入测试题
5. **实用性**：结合实际案例，避免纯理论

# 对话类型说明

## 1. 文本对话 (type: "text")
用途：讲解概念、说明要点、过渡引导
示例：
{
  "id": 1,
  "type": "text",
  "content": "你好！今天我们来学习BPMN流程建模。",
  "points": 2
}

## 2. 图片对话 (type: "image")
用途：展示图表、流程图、示意图
示例：
{
  "id": 2,
  "type": "image",
  "content": "让我们看看BPMN的基本元素：",
  "imageUrl": "/assets/images/bpmn-elements.png",
  "imageAlt": "BPMN基本元素图",
  "points": 3
}

## 3. 测试对话 (type: "test")
用途：检验学习效果，强化记忆
示例：
{
  "id": 3,
  "type": "test",
  "content": "来做个小测试！",
  "question": "以下哪个是BPMN的基本元素？",
  "options": [
    "事件（Events）",
    "活动（Activities）",
    "网关（Gateways）",
    "以上都是"
  ],
  "correctAnswer": 3,
  "explanation": "BPMN包含四大类基本元素：事件、活动、网关和连接对象。",
  "points": 5
}

# 积分分配规则
- 文本对话：2分
- 图片对话：3分
- 测试对话：5分（答对额外+5分）
- 总步骤建议：10-20个对话

# 测试题设计要求
1. 每3-5个知识点插入一个测试
2. 4个选项，难度适中
3. 必须提供详细的explanation
4. correctAnswer是数组索引（0-3）

# 输出格式要求
必须返回纯JSON格式，不要包含任何其他文字说明：
{
  "title": "课程标题",
  "description": "课程简介",
  "conversations": [
    // 对话数组，按顺序排列
  ]
}

# 注意事项
- 所有对话id必须连续递增
- imageUrl使用占位符："/assets/images/[描述性文件名].png"
- 对话内容避免使用双引号，改用单引号或中文引号
- 确保JSON格式完全正确，可被JSON.parse解析`,

    /**
     * 根据学习主题生成具体的prompt
     */
    generatePrompt(userInput) {
        const { topic, keyPoints, testCount = 2, includeImages = true, specialRequirements = '' } = userInput;

        return `${this.CONVERSATION_GENERATOR}

# 用户需求
**学习主题**: ${topic}

**知识点列表**:
${keyPoints.map((point, index) => `${index + 1}. ${point}`).join('\n')}

**测试题数量**: ${testCount}个

**是否需要图片**: ${includeImages ? '是（请在合适的位置插入图片说明）' : '否'}

**特殊要求**: ${specialRequirements || '无'}

# 开始生成
请根据以上需求，生成完整的对话式学习内容JSON数据。记住：
1. 对话要像微信聊天一样自然
2. 每条对话20-50字
3. 在关键知识点后插入测试
4. 确保JSON格式正确
5. 只返回JSON，不要任何额外说明

现在开始生成：`;
    },

    /**
     * 快速模板 - 预定义场景
     */
    QUICK_TEMPLATES: {
        // BPMN流程管理
        bpmn: {
            name: 'BPMN流程建模',
            description: '适用于流程管理、BPMN相关内容',
            defaultKeyPoints: [
                'BPMN的定义和作用',
                '四大基本元素：事件、活动、网关、连接对象',
                '常用符号的含义',
                '实际案例：请假流程',
                '最佳实践建议'
            ],
            testCount: 2,
            includeImages: true
        },
        
        // 流程优化
        processOptimization: {
            name: '流程优化方法',
            description: '适用于流程改进、优化相关内容',
            defaultKeyPoints: [
                '流程优化的目标和意义',
                '识别流程瓶颈的方法',
                '消除浪费的七大原则',
                '自动化和数字化策略',
                '持续改进的循环'
            ],
            testCount: 2,
            includeImages: true
        },

        // 工作流管理
        workflow: {
            name: '工作流管理',
            description: '适用于工作流、任务管理相关内容',
            defaultKeyPoints: [
                '工作流的基本概念',
                '工作流引擎的作用',
                '任务分配和跟踪',
                '异常处理机制',
                '工作流优化技巧'
            ],
            testCount: 2,
            includeImages: true
        },

        // 通用知识点
        general: {
            name: '通用知识点',
            description: '适用于一般性概念讲解',
            defaultKeyPoints: [
                '核心概念介绍',
                '基本原理说明',
                '实际应用场景',
                '常见问题解答',
                '总结和建议'
            ],
            testCount: 1,
            includeImages: false
        }
    },

    /**
     * 优化用户输入的prompt
     */
    optimizeUserInput(rawInput) {
        // 如果用户输入的是简单文本，自动结构化
        if (typeof rawInput === 'string') {
            return {
                topic: rawInput,
                keyPoints: [
                    `${rawInput}的定义和背景`,
                    `${rawInput}的核心要素`,
                    `${rawInput}的实际应用`,
                    `${rawInput}的最佳实践`
                ],
                testCount: 1,
                includeImages: false,
                specialRequirements: ''
            };
        }
        return rawInput;
    },

    /**
     * 验证生成的JSON是否符合规范
     */
    validateConversationJSON(jsonData) {
        const errors = [];

        // 检查基本结构
        if (!jsonData.title) {
            errors.push('缺少title字段');
        }

        if (!jsonData.conversations || !Array.isArray(jsonData.conversations)) {
            errors.push('缺少conversations数组');
            return { valid: false, errors };
        }

        // 检查每个对话
        jsonData.conversations.forEach((conv, index) => {
            if (!conv.id) {
                errors.push(`对话${index + 1}缺少id字段`);
            }

            if (!conv.type || !['text', 'image', 'test'].includes(conv.type)) {
                errors.push(`对话${index + 1}的type字段无效：${conv.type}`);
            }

            if (!conv.content && conv.type !== 'test') {
                errors.push(`对话${index + 1}缺少content字段`);
            }

            if (conv.type === 'image' && !conv.imageUrl) {
                errors.push(`对话${index + 1}是图片类型但缺少imageUrl`);
            }

            if (conv.type === 'test') {
                if (!conv.question) {
                    errors.push(`对话${index + 1}是测试类型但缺少question`);
                }
                if (!conv.options || !Array.isArray(conv.options) || conv.options.length !== 4) {
                    errors.push(`对话${index + 1}的options必须是包含4个选项的数组`);
                }
                if (typeof conv.correctAnswer !== 'number' || conv.correctAnswer < 0 || conv.correctAnswer > 3) {
                    errors.push(`对话${index + 1}的correctAnswer必须是0-3的数字`);
                }
            }

            if (typeof conv.points !== 'number' || conv.points < 0) {
                errors.push(`对话${index + 1}的points字段无效`);
            }
        });

        return {
            valid: errors.length === 0,
            errors: errors
        };
    },

    /**
     * 示例数据 - 用于演示
     */
    EXAMPLE_OUTPUT: {
        "title": "BPMN网关详解",
        "description": "深入学习BPMN中网关的类型和使用场景",
        "conversations": [
            {
                "id": 1,
                "type": "text",
                "content": "你好！今天我们来深入学习BPMN中的网关。",
                "points": 2
            },
            {
                "id": 2,
                "type": "text",
                "content": "网关在BPMN中就像交通路口，用来控制流程的走向。",
                "points": 2
            },
            {
                "id": 3,
                "type": "image",
                "content": "让我们看看BPMN中的四种网关类型：",
                "imageUrl": "/assets/images/bpmn-gateway-types.png",
                "imageAlt": "BPMN网关类型图",
                "points": 3
            },
            {
                "id": 4,
                "type": "text",
                "content": "排他网关（XOR）：只能选择一条路径，最常用的网关类型。",
                "points": 2
            },
            {
                "id": 5,
                "type": "test",
                "content": "来测试一下你的理解！",
                "question": "在请假流程中，经理审批环节最适合使用哪种网关？",
                "options": [
                    "并行网关（Parallel）",
                    "排他网关（Exclusive）",
                    "包容网关（Inclusive）",
                    "事件网关（Event-based）"
                ],
                "correctAnswer": 1,
                "explanation": "经理审批只有'批准'或'拒绝'两种结果，只会走其中一条路径，所以使用排他网关最合适。",
                "points": 5
            },
            {
                "id": 6,
                "type": "text",
                "content": "很好！并行网关用于同时执行多个任务，比如同时发通知给多个部门。",
                "points": 2
            },
            {
                "id": 7,
                "type": "image",
                "content": "这是一个使用并行网关的实际案例：",
                "imageUrl": "/assets/images/parallel-gateway-example.png",
                "imageAlt": "并行网关案例",
                "points": 3
            },
            {
                "id": 8,
                "type": "text",
                "content": "记住：选择合适的网关类型，能让你的流程图更清晰、更易懂！",
                "points": 2
            }
        ]
    }
};

/**
 * AI对话生成配置
 */
export const AIGeneratorConfig = {
    // API配置（可根据实际使用的AI服务调整）
    apiEndpoint: '/api/ai/generate-conversation',
    timeout: 30000, // 30秒超时
    maxRetries: 2,

    // 生成参数
    temperature: 0.7, // 创造性程度
    maxTokens: 2000,  // 最大token数

    // UI配置
    showPreview: true,
    allowEdit: true,
    autoSave: true
};

