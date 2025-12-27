/**
 * @file simple-ai-prompts.js
 * @description 简化版AI提示词配置 - 专注于标准化内容生成
 * @version 1.0.0
 */

export const SimpleAIPrompts = {
    /**
     * 主提示词模板 - 标准化生成
     */
    STANDARD_GENERATOR: `你是一个专业的企业培训内容设计师。请根据用户提供的信息生成统一规范的对话式学习内容。

# 生成原则
1. **统一风格**: 所有生成的内容都采用微信聊天式对话风格
2. **标准结构**: 严格按照规定的JSON格式输出
3. **适度互动**: 每4-6个对话添加一个测试题
4. **循序渐进**: 从简单到复杂，逐步深入
5. **实用导向**: 结合实际工作场景，避免纯理论

# 对话设计规范

## 文本对话 (type: "text")
- 每段对话20-60字，易于阅读
- 语气轻松友好，像朋友聊天
- 关键信息用emoji强调
- 例子：{"id": 1, "type": "text", "content": "你好！今天我们来学习BPMN网关 🚪", "points": 2}

## 图片对话 (type: "image") 
- 在需要图解说明的地方使用
- 提供清晰的图片描述
- 例子：{"id": 2, "type": "image", "content": "来看看BPMN网关的基本类型：", "imageUrl": "/assets/images/bpmn-gateways.png", "imageAlt": "BPMN网关类型图", "points": 3}

## 测试对话 (type: "test")
- 每3-5个知识点后插入测试
- 4个选项，难度适中
- 必须提供答案解释
- 例子：{"id": 3, "type": "test", "question": "排他网关的作用是什么？", "options": ["并行执行", "选择一条路径", "汇聚流程", "循环执行"], "correctAnswer": 1, "explanation": "排他网关用于选择一条执行路径，只有满足条件的路径会被执行。", "points": 5}

# 积分分配标准
- 文本对话：2分
- 图片对话：3分  
- 测试对话：5分（答对再+5分）
- 建议总计：50-100分

# 严格输出格式
必须返回以下JSON结构，不要包含任何其他内容：

{
  "title": "课程标题",
  "description": "课程简介（20-50字）",
  "totalSteps": 对话总数,
  "estimatedTime": "5-15分钟",
  "conversations": [
    {
      "id": 连续递增ID,
      "type": "text|image|test",
      "content": "对话内容",
      "points": 积分值,
      "imageUrl": "图片路径（仅image类型）",
      "imageAlt": "图片说明（仅image类型）", 
      "question": "题目（仅test类型）",
      "options": ["选项数组（仅test类型）"],
      "correctAnswer": 正确答案索引,
      "explanation": "答案解释（仅test类型）"
    }
  ]
}

# 质量要求
- JSON格式必须正确，可被JSON.parse()解析
- 对话内容不使用双引号，改用单引号或中文引号
- 所有字段都要填写，不能为空
- imageUrl使用占位符格式：/assets/images/[描述].png`,

    /**
     * 根据内容类型获取专门的指令
     */
    getTypeSpecificInstructions(type) {
        const instructions = {
            concept: `
# 概念学习专项要求
- 先介绍概念的定义和背景
- 用生活化的例子帮助理解  
- 解释概念的重要性和应用场景
- 分解复杂概念为简单要素
- 每个重要概念后加一个测试题`,

            process: `
# 流程指导专项要求
- 按照操作顺序组织内容
- 每个步骤清晰明确，可操作
- 重要步骤配图说明
- 提供操作注意事项和技巧
- 在关键节点设置检查测试题`,

            case: `
# 案例分析专项要求  
- 以真实场景为背景
- 描述问题和挑战
- 分析解决思路和方法
- 总结经验教训
- 通过测试题检验理解程度`
        };

        return instructions[type] || instructions.concept;
    },

    /**
     * 构建完整的提示词
     */
    buildPrompt(inputData) {
        const typeInstructions = this.getTypeSpecificInstructions(inputData.template);
        const options = inputData.options || {};

        return `${this.STANDARD_GENERATOR}

${typeInstructions}

# 用户输入内容
**学习主题**: ${inputData.title}

**学习目标**:
${inputData.objectivesList?.map((obj, i) => `${i+1}. ${obj}`).join('\n') || ''}

**核心知识点**:
${inputData.content}

# 生成选项
${options.includeTest ? '✅ 包含测试题 - 在适当位置插入测试' : '❌ 不包含测试题'}
${options.includeImages ? '✅ 包含配图 - 在需要图解的地方添加图片' : '❌ 不包含配图'}  
${options.conversationalStyle ? '✅ 对话式风格 - 使用轻松的聊天语气' : '✅ 正式教学风格 - 使用规范的教学语气'}

# 开始生成
请严格按照上述要求生成JSON格式的对话式学习内容。记住：
1. 只返回JSON，不要任何额外说明文字
2. 确保JSON格式完全正确
3. 对话要自然流畅，循序渐进  
4. 测试题要有教育意义
5. 整体内容控制在10-20个对话步骤

现在开始生成：`;
    },

    /**
     * 预设模板数据
     */
    TEMPLATE_EXAMPLES: {
        bpmn_gateway: {
            title: "BPMN网关使用指南",
            objectives: "理解网关概念\n掌握不同网关类型\n学会实际应用",
            content: `## 什么是BPMN网关
网关用于控制流程的分支和汇聚，是流程建模的重要元素。

## 排他网关（XOR）
- 只允许选择一条输出路径
- 基于条件进行判断
- 用菱形符号表示，内有X标记

## 并行网关（AND）  
- 同时激活所有输出路径
- 用于并行执行的场景
- 用菱形符号表示，内有+标记

## 实际应用案例
在请假审批流程中，可以使用排他网关根据请假天数选择不同的审批路径。`
        },

        process_optimization: {
            title: "流程优化实战方法",
            objectives: "识别流程瓶颈\n掌握优化技巧\n应用改进方法",  
            content: `## 流程优化概述
通过分析现有流程，找出问题点，设计更高效的执行方式。

## 瓶颈识别方法
- 数据分析：统计各环节耗时
- 现场观察：发现实际问题
- 用户反馈：收集使用体验

## 优化策略
- 消除浪费：去除非必要环节
- 并行处理：同时执行可并行任务  
- 自动化：用技术替代人工操作

## 改进效果评估
建立指标体系，定期监控优化效果。`
        }
    },

    /**
     * 验证生成结果
     */
    validateResult(jsonString) {
        try {
            const data = JSON.parse(jsonString);
            
            // 必需字段检查
            const requiredFields = ['title', 'description', 'conversations'];
            for (let field of requiredFields) {
                if (!data[field]) {
                    return { valid: false, error: `缺少必需字段: ${field}` };
                }
            }
            
            // 对话数组检查
            if (!Array.isArray(data.conversations) || data.conversations.length === 0) {
                return { valid: false, error: '对话数组为空或格式错误' };
            }
            
            // 对话内容检查
            for (let i = 0; i < data.conversations.length; i++) {
                const conv = data.conversations[i];
                if (!conv.id || !conv.type || !conv.content) {
                    return { valid: false, error: `第${i+1}个对话缺少必需字段` };
                }
                
                // 测试题特殊检查
                if (conv.type === 'test') {
                    if (!conv.question || !conv.options || !conv.hasOwnProperty('correctAnswer')) {
                        return { valid: false, error: `第${i+1}个测试题格式不正确` };
                    }
                }
            }
            
            return { valid: true };
            
        } catch (error) {
            return { valid: false, error: 'JSON格式错误: ' + error.message };
        }
    }
};

export default SimpleAIPrompts;