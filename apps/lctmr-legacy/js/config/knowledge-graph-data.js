/**
 * @file knowledge-graph-data.js
 * @description 知识图谱数据配置 - 定义学习路径和节点关系
 * @version 1.0.0
 * @author LCTMR Team
 */

/**
 * 示例知识图谱数据
 * 可以根据实际课程内容进行定制
 */
export const defaultGraphData = {
    // 图谱元数据
    metadata: {
        id: 'default-knowledge-graph',
        title: '默认学习路径',
        description: '这是一个示例学习路径，展示了知识图谱的结构',
        version: '1.0.0'
    },
    
    // 节点定义
    nodes: [
        // 起始节点
        {
            id: 'start-1',
            title: '开始学习',
            description: '欢迎来到学习之旅！这是你的起点，让我们开始探索知识的世界。',
            type: 'start',
            x: 0,
            y: 0,
            dependencies: [],
            blockId: 'block-start-1',
            points: 10
        },

        // 第一层 - 基础知识
        {
            id: 'basic-1',
            title: '基础概念',
            description: '学习核心基础概念，为后续学习打下坚实基础。',
            type: 'normal',
            x: -200,
            y: 150,
            dependencies: ['start-1'],
            blockId: 'block-basic-1',
            points: 15
        },
        {
            id: 'basic-2',
            title: '基本原理',
            description: '理解基本原理和工作机制。',
            type: 'normal',
            x: 0,
            y: 150,
            dependencies: ['start-1'],
            blockId: 'block-basic-2',
            points: 15
        },
        {
            id: 'basic-3',
            title: '入门实践',
            description: '通过简单的实践练习巩固所学知识。',
            type: 'normal',
            x: 200,
            y: 150,
            dependencies: ['start-1'],
            blockId: 'block-basic-3',
            points: 15
        },

        // 第二层 - 进阶知识
        {
            id: 'intermediate-1',
            title: '进阶技巧',
            description: '学习更深入的技巧和方法。',
            type: 'major',
            x: -200,
            y: 300,
            dependencies: ['basic-1', 'basic-2'],
            blockId: 'block-intermediate-1',
            points: 25
        },
        {
            id: 'intermediate-2',
            title: '实战演练',
            description: '通过实际案例提升实践能力。',
            type: 'major',
            x: 0,
            y: 300,
            dependencies: ['basic-2', 'basic-3'],
            blockId: 'block-intermediate-2',
            points: 25
        },
        {
            id: 'test-1',
            title: '基础测试',
            description: '测试你对基础知识的掌握程度。',
            type: 'test',
            x: 200,
            y: 300,
            dependencies: ['basic-3'],
            blockId: 'block-test-1',
            points: 30
        },

        // 第三层 - 高级知识
        {
            id: 'advanced-1',
            title: '高级应用',
            description: '学习高级应用场景和最佳实践。',
            type: 'major',
            x: -150,
            y: 450,
            dependencies: ['intermediate-1', 'intermediate-2'],
            blockId: 'block-advanced-1',
            points: 35
        },
        {
            id: 'advanced-2',
            title: '优化技巧',
            description: '掌握性能优化和高级技巧。',
            type: 'normal',
            x: 0,
            y: 450,
            dependencies: ['intermediate-2', 'test-1'],
            blockId: 'block-advanced-2',
            points: 30
        },
        {
            id: 'advanced-3',
            title: '项目实战',
            description: '完成一个完整的实战项目。',
            type: 'major',
            x: 150,
            y: 450,
            dependencies: ['intermediate-2'],
            blockId: 'block-advanced-3',
            points: 40
        },

        // 第四层 - 专家级
        {
            id: 'expert-1',
            title: '架构设计',
            description: '学习系统架构设计的核心思想。',
            type: 'major',
            x: -100,
            y: 600,
            dependencies: ['advanced-1', 'advanced-2'],
            blockId: 'block-expert-1',
            points: 45
        },
        {
            id: 'expert-2',
            title: '综合实战',
            description: '综合运用所学知识解决复杂问题。',
            type: 'major',
            x: 100,
            y: 600,
            dependencies: ['advanced-2', 'advanced-3'],
            blockId: 'block-expert-2',
            points: 45
        },

        // 最终测试
        {
            id: 'final-test',
            title: '毕业考核',
            description: '通过综合测试，验证你的学习成果！',
            type: 'test',
            x: 0,
            y: 750,
            dependencies: ['expert-1', 'expert-2'],
            blockId: 'block-final-test',
            points: 100
        }
    ]
};

/**
 * 编程基础学习路径示例
 */
export const programmingGraphData = {
    metadata: {
        id: 'programming-basics',
        title: '编程基础学习路径',
        description: '从零开始学习编程的系统化路径',
        version: '1.0.0'
    },
    
    nodes: [
        {
            id: 'prog-start',
            title: '编程入门',
            description: '了解编程的基本概念和重要性',
            type: 'start',
            x: 0,
            y: 0,
            dependencies: [],
            blockId: 'block-prog-start',
            points: 10
        },
        {
            id: 'variables',
            title: '变量与数据类型',
            description: '学习变量声明和基本数据类型',
            type: 'normal',
            x: -150,
            y: 120,
            dependencies: ['prog-start'],
            blockId: 'block-variables',
            points: 20
        },
        {
            id: 'operators',
            title: '运算符',
            description: '掌握各种运算符的使用',
            type: 'normal',
            x: 0,
            y: 120,
            dependencies: ['prog-start'],
            blockId: 'block-operators',
            points: 20
        },
        {
            id: 'control-flow',
            title: '流程控制',
            description: '学习条件语句和循环结构',
            type: 'major',
            x: 150,
            y: 120,
            dependencies: ['prog-start'],
            blockId: 'block-control-flow',
            points: 25
        },
        {
            id: 'functions',
            title: '函数',
            description: '理解函数的定义和使用',
            type: 'major',
            x: -75,
            y: 240,
            dependencies: ['variables', 'operators', 'control-flow'],
            blockId: 'block-functions',
            points: 30
        },
        {
            id: 'arrays',
            title: '数组',
            description: '学习数组的创建和操作',
            type: 'normal',
            x: 75,
            y: 240,
            dependencies: ['variables', 'control-flow'],
            blockId: 'block-arrays',
            points: 25
        },
        {
            id: 'objects',
            title: '对象',
            description: '掌握对象的概念和使用',
            type: 'major',
            x: 0,
            y: 360,
            dependencies: ['functions', 'arrays'],
            blockId: 'block-objects',
            points: 30
        },
        {
            id: 'test-basic',
            title: '基础测试',
            description: '测试基础编程能力',
            type: 'test',
            x: 0,
            y: 480,
            dependencies: ['objects'],
            blockId: 'block-test-basic',
            points: 50
        }
    ]
};

/**
 * 对话式学习路径示例
 */
export const conversationGraphData = {
    metadata: {
        id: 'conversation-learning',
        title: '对话式学习路径',
        description: '通过对话式交互学习新知识',
        version: '1.0.0'
    },
    
    nodes: [
        {
            id: 'conv-start',
            title: '欢迎',
            description: '开始你的对话式学习之旅',
            type: 'start',
            dependencies: [],
            blockId: 'block-conv-start',
            points: 10
        },
        {
            id: 'conv-basic',
            title: '基础对话',
            description: '学习基本的对话技巧',
            type: 'normal',
            dependencies: ['conv-start'],
            blockId: 'block-conv-basic',
            points: 20
        },
        {
            id: 'conv-practice',
            title: '对话练习',
            description: '通过练习巩固所学',
            type: 'major',
            dependencies: ['conv-basic'],
            blockId: 'block-conv-practice',
            points: 30
        }
    ]
};

/**
 * 流程管理知识图谱 - 参考流放之路2地图设计
 * 特点：
 * 1. 中心节点清晰，周围按层级分布
 * 2. 每个节点间距合理，避免重叠
 * 3. 线条路径清晰，减少交叉
 * 4. 支持多条学习路径选择
 */
export const processManagementGraphData = {
    metadata: {
        id: 'process-management',
        title: '流程管理知识图谱',
        description: '从基础到高级的流程管理技能树，支持多种学习路径',
        version: '1.0.0'
    },
    
    nodes: [
        // 中心起始节点
        {
            id: 'process-foundation',
            title: '流程基础',
            description: '流程管理的核心概念和基本原理',
            type: 'start',
            dependencies: [],
            blockId: 'block-process-foundation',
            points: 10
        },

        // 第一层：四大基础领域（4个节点，均匀分布）
        {
            id: 'business-process',
            title: '业务流程',
            description: '理解和设计业务流程',
            type: 'normal',
            dependencies: ['process-foundation'],
            blockId: 'block-business-process',
            points: 20
        },
        {
            id: 'workflow-design',
            title: '工作流设计',
            description: '设计高效的工作流程',
            type: 'normal',
            dependencies: ['process-foundation'],
            blockId: 'block-workflow-design',
            points: 20
        },
        {
            id: 'data-flow',
            title: '数据流程',
            description: '管理数据在系统中的流动',
            type: 'normal',
            dependencies: ['process-foundation'],
            blockId: 'block-data-flow',
            points: 20
        },
        {
            id: 'quality-control',
            title: '质量控制',
            description: '流程质量管理和改进',
            type: 'normal',
            dependencies: ['process-foundation'],
            blockId: 'block-quality-control',
            points: 20
        },

        // 第二层：专业化技能（6个节点，螺旋分布）
        {
            id: 'bpm-tools',
            title: 'BPM工具',
            description: '业务流程管理工具的使用',
            type: 'major',
            dependencies: ['business-process'],
            blockId: 'block-bpm-tools',
            points: 30
        },
        {
            id: 'workflow-automation',
            title: '工作流自动化',
            description: '自动化工作流程的设计',
            type: 'major',
            dependencies: ['workflow-design'],
            blockId: 'block-workflow-automation',
            points: 30
        },
        {
            id: 'data-integration',
            title: '数据集成',
            description: '多系统数据集成方案',
            type: 'major',
            dependencies: ['data-flow'],
            blockId: 'block-data-integration',
            points: 30
        },
        {
            id: 'process-optimization',
            title: '流程优化',
            description: '分析和优化现有流程',
            type: 'major',
            dependencies: ['quality-control'],
            blockId: 'block-process-optimization',
            points: 30
        },
        {
            id: 'change-management',
            title: '变革管理',
            description: '流程变革的实施和管理',
            type: 'major',
            dependencies: ['business-process', 'quality-control'],
            dependencyLogic: 'OR',
            blockId: 'block-change-management',
            points: 35
        },
        {
            id: 'compliance-management',
            title: '合规管理',
            description: '确保流程符合法规要求',
            type: 'major',
            dependencies: ['workflow-design', 'quality-control'],
            dependencyLogic: 'OR',
            blockId: 'block-compliance-management',
            points: 35
        },

        // 第三层：高级技能（4个节点，需要多个前置）
        {
            id: 'enterprise-architecture',
            title: '企业架构',
            description: '设计企业级流程架构',
            type: 'major',
            dependencies: ['bpm-tools', 'workflow-automation'],
            blockId: 'block-enterprise-architecture',
            points: 50
        },
        {
            id: 'data-governance',
            title: '数据治理',
            description: '企业数据治理框架',
            type: 'major',
            dependencies: ['data-integration', 'compliance-management'],
            blockId: 'block-data-governance',
            points: 50
        },
        {
            id: 'digital-transformation',
            title: '数字化转型',
            description: '推动企业数字化转型',
            type: 'major',
            dependencies: ['process-optimization', 'change-management'],
            blockId: 'block-digital-transformation',
            points: 50
        },
        {
            id: 'process-intelligence',
            title: '流程智能',
            description: 'AI驱动的流程分析和优化',
            type: 'major',
            dependencies: ['bpm-tools', 'data-integration'],
            blockId: 'block-process-intelligence',
            points: 55
        },

        // 第四层：专家级认证（2个节点，汇聚多条路径）
        {
            id: 'process-expert-cert',
            title: '流程管理专家认证',
            description: '流程管理领域的专业认证',
            type: 'test',
            dependencies: ['enterprise-architecture', 'digital-transformation'],
            dependencyLogic: 'OR',
            blockId: 'block-process-expert-cert',
            points: 100
        },
        {
            id: 'data-process-expert-cert',
            title: '数据流程专家认证',
            description: '数据流程管理的专业认证',
            type: 'test',
            dependencies: ['data-governance', 'process-intelligence'],
            dependencyLogic: 'OR',
            blockId: 'block-data-process-expert-cert',
            points: 100
        }
    ]
};

/**
 * 蜘蛛网式学习路径 - 多路径选择示例（保留作为备用）
 */
export const spiderWebGraphData = {
    metadata: {
        id: 'spider-web-learning',
        title: '技能树学习路径',
        description: '选择你自己的学习路径，像探索技能树一样自由学习',
        version: '1.0.0'
    },
    
    nodes: [
        // 中心起始节点
        {
            id: 'core-start',
            title: '核心概念',
            description: '所有学习路径的起点，掌握核心基础知识',
            type: 'start',
            dependencies: [],
            blockId: 'block-core-start',
            points: 10
        },

        // 第一圈：基础技能分支（可选任意一个或多个）
        {
            id: 'frontend-basic',
            title: '前端基础',
            description: '学习HTML、CSS和JavaScript基础',
            type: 'normal',
            dependencies: ['core-start'],
            blockId: 'block-frontend-basic',
            points: 20
        },
        {
            id: 'backend-basic',
            title: '后端基础',
            description: '学习服务器端编程基础',
            type: 'normal',
            dependencies: ['core-start'],
            blockId: 'block-backend-basic',
            points: 20
        },
        {
            id: 'database-basic',
            title: '数据库基础',
            description: '学习数据存储和查询',
            type: 'normal',
            dependencies: ['core-start'],
            blockId: 'block-database-basic',
            points: 20
        },
        {
            id: 'design-basic',
            title: '设计基础',
            description: '学习UI/UX设计原则',
            type: 'normal',
            dependencies: ['core-start'],
            blockId: 'block-design-basic',
            points: 15
        },

        // 第二圈：进阶分支（可以选择多条路径）
        {
            id: 'react-advanced',
            title: 'React进阶',
            description: '深入学习React框架',
            type: 'major',
            dependencies: ['frontend-basic'],
            blockId: 'block-react-advanced',
            points: 30
        },
        {
            id: 'vue-advanced',
            title: 'Vue进阶',
            description: '深入学习Vue框架',
            type: 'major',
            dependencies: ['frontend-basic'],
            blockId: 'block-vue-advanced',
            points: 30
        },
        {
            id: 'nodejs-advanced',
            title: 'Node.js进阶',
            description: '构建高性能后端应用',
            type: 'major',
            dependencies: ['backend-basic'],
            blockId: 'block-nodejs-advanced',
            points: 30
        },
        {
            id: 'python-advanced',
            title: 'Python进阶',
            description: '使用Python开发后端服务',
            type: 'major',
            dependencies: ['backend-basic'],
            blockId: 'block-python-advanced',
            points: 30
        },
        {
            id: 'sql-advanced',
            title: 'SQL进阶',
            description: '复杂查询和数据库优化',
            type: 'major',
            dependencies: ['database-basic'],
            blockId: 'block-sql-advanced',
            points: 25
        },
        {
            id: 'nosql-advanced',
            title: 'NoSQL数据库',
            description: '学习MongoDB、Redis等',
            type: 'major',
            dependencies: ['database-basic'],
            blockId: 'block-nosql-advanced',
            points: 25
        },

        // 第三圈：专业化路径（需要多个前置条件）
        {
            id: 'fullstack-web',
            title: '全栈Web开发',
            description: '成为全栈开发者',
            type: 'major',
            dependencies: ['react-advanced', 'nodejs-advanced', 'sql-advanced'],
            blockId: 'block-fullstack-web',
            points: 50
        },
        {
            id: 'frontend-expert',
            title: '前端专家',
            description: '精通前端技术栈',
            type: 'major',
            dependencies: ['react-advanced', 'vue-advanced', 'design-basic'],
            blockId: 'block-frontend-expert',
            points: 45
        },
        {
            id: 'backend-expert',
            title: '后端专家',
            description: '精通后端架构设计',
            type: 'major',
            dependencies: ['nodejs-advanced', 'python-advanced', 'nosql-advanced'],
            blockId: 'block-backend-expert',
            points: 45
        },
        {
            id: 'data-engineer',
            title: '数据工程师',
            description: '专注数据处理和分析',
            type: 'major',
            dependencies: ['python-advanced', 'sql-advanced', 'nosql-advanced'],
            blockId: 'block-data-engineer',
            points: 45
        },

        // 第四圈：跨领域融合（可以从多个路径达到）
        {
            id: 'microservices',
            title: '微服务架构',
            description: '设计和实现微服务系统',
            type: 'major',
            dependencies: ['fullstack-web', 'backend-expert'],
            blockId: 'block-microservices',
            points: 60
        },
        {
            id: 'cloud-native',
            title: '云原生开发',
            description: '容器化和Kubernetes',
            type: 'major',
            dependencies: ['backend-expert'],
            blockId: 'block-cloud-native',
            points: 55
        },
        {
            id: 'performance-optimization',
            title: '性能优化',
            description: '全栈性能调优',
            type: 'major',
            dependencies: ['fullstack-web', 'frontend-expert'],
            blockId: 'block-performance-optimization',
            points: 50
        },
        {
            id: 'data-visualization',
            title: '数据可视化',
            description: '将数据转化为洞察',
            type: 'major',
            dependencies: ['frontend-expert', 'data-engineer'],
            blockId: 'block-data-visualization',
            points: 50
        },

        // 最终测试（多路径汇聚）
        {
            id: 'system-architect-test',
            title: '系统架构师认证',
            description: '证明你的综合能力',
            type: 'test',
            dependencies: ['microservices', 'cloud-native'],
            blockId: 'block-system-architect-test',
            points: 100
        },
        {
            id: 'senior-developer-test',
            title: '高级开发者认证',
            description: '全面的技术能力考核',
            type: 'test',
            dependencies: ['performance-optimization', 'data-visualization'],
            blockId: 'block-senior-developer-test',
            points: 100
        }
    ]
};

/**
 * 根据课程类型获取对应的图谱数据
 */
export function getGraphDataByType(type = 'default') {
    const graphMap = {
        'default': defaultGraphData,
        'programming': programmingGraphData,
        'conversation': conversationGraphData,
        'spiderweb': spiderWebGraphData,
        'process-management': processManagementGraphData  // 流程管理图谱
    };
    
    return graphMap[type] || defaultGraphData;
}

/**
 * 创建自定义图谱数据
 * @param {Object} metadata - 图谱元数据
 * @param {Array} nodes - 节点数组
 * @returns {Object} 图谱数据对象
 */
export function createCustomGraph(metadata, nodes) {
    return {
        metadata: {
            id: metadata.id || 'custom-graph',
            title: metadata.title || '自定义学习路径',
            description: metadata.description || '',
            version: metadata.version || '1.0.0'
        },
        nodes: nodes
    };
}

/**
 * 验证图谱数据的有效性
 * @param {Object} graphData - 图谱数据
 * @returns {Object} 验证结果 { valid: boolean, errors: Array }
 */
export function validateGraphData(graphData) {
    const errors = [];
    
    if (!graphData || !graphData.nodes || !Array.isArray(graphData.nodes)) {
        errors.push('图谱数据格式无效');
        return { valid: false, errors };
    }
    
    // 检查是否有起始节点
    const hasStartNode = graphData.nodes.some(n => n.type === 'start' || n.dependencies.length === 0);
    if (!hasStartNode) {
        errors.push('缺少起始节点');
    }
    
    // 检查节点ID唯一性
    const ids = new Set();
    graphData.nodes.forEach(node => {
        if (!node.id) {
            errors.push(`节点缺少ID: ${node.title}`);
        } else if (ids.has(node.id)) {
            errors.push(`重复的节点ID: ${node.id}`);
        } else {
            ids.add(node.id);
        }
    });
    
    // 检查依赖关系有效性
    graphData.nodes.forEach(node => {
        if (node.dependencies && Array.isArray(node.dependencies)) {
            node.dependencies.forEach(depId => {
                if (!ids.has(depId)) {
                    errors.push(`节点 ${node.id} 的依赖 ${depId} 不存在`);
                }
            });
        }
    });
    
    // 检查循环依赖
    const visited = new Set();
    const recursionStack = new Set();
    
    function hasCycle(nodeId) {
        if (recursionStack.has(nodeId)) {
            errors.push(`检测到循环依赖，涉及节点: ${nodeId}`);
            return true;
        }
        
        if (visited.has(nodeId)) {
            return false;
        }
        
        visited.add(nodeId);
        recursionStack.add(nodeId);
        
        const node = graphData.nodes.find(n => n.id === nodeId);
        if (node && node.dependencies) {
            for (const depId of node.dependencies) {
                if (hasCycle(depId)) {
                    return true;
                }
            }
        }
        
        recursionStack.delete(nodeId);
        return false;
    }
    
    graphData.nodes.forEach(node => {
        if (!visited.has(node.id)) {
            hasCycle(node.id);
        }
    });
    
    return {
        valid: errors.length === 0,
        errors
    };
}

/**
 * 自动布局算法 - 支持多种布局模式
 * @param {Object} graphData - 图谱数据
 * @param {Object} options - 布局选项
 * @returns {Object} 布局后的图谱数据
 */
export function autoLayout(graphData, options = {}) {
    const {
        width = 1200,
        height = 800,
        nodeSpacing = 150,
        iterations = 100,
        layoutType = 'hierarchical' // hierarchical, radial, force, spider
    } = options;
    
    // 复制数据避免修改原始数据
    const layoutData = JSON.parse(JSON.stringify(graphData));
    const nodes = layoutData.nodes;
    
    // 如果节点已有坐标，则不重新布局
    const hasCoordinates = nodes.every(n => n.x !== undefined && n.y !== undefined);
    if (hasCoordinates) {
        return layoutData;
    }
    
    // 根据布局类型选择算法
    switch (layoutType) {
        case 'radial':
            return radialLayout(layoutData, { nodeSpacing });
        case 'spider':
            return spiderWebLayout(layoutData, { nodeSpacing });
        case 'force':
            return forceDirectedLayout(layoutData, { nodeSpacing, iterations });
        default:
            return hierarchicalLayout(layoutData, { nodeSpacing });
    }
}

/**
 * 层次布局（原有的布局算法）
 */
function hierarchicalLayout(layoutData, options) {
    const { nodeSpacing = 150 } = options;
    const nodes = layoutData.nodes;
    
    const layers = [];
    const nodeToLayer = new Map();
    
    // 找到起始节点
    const startNodes = nodes.filter(n => !n.dependencies || n.dependencies.length === 0);
    startNodes.forEach(node => {
        nodeToLayer.set(node.id, 0);
        if (!layers[0]) layers[0] = [];
        layers[0].push(node);
    });
    
    // 计算每个节点的层级
    let changed = true;
    let maxIterations = 100;
    while (changed && maxIterations-- > 0) {
        changed = false;
        nodes.forEach(node => {
            if (!nodeToLayer.has(node.id) && node.dependencies && node.dependencies.length > 0) {
                const allDepsAssigned = node.dependencies.every(depId => nodeToLayer.has(depId));
                if (allDepsAssigned) {
                    const maxDepLayer = Math.max(...node.dependencies.map(depId => nodeToLayer.get(depId)));
                    const layer = maxDepLayer + 1;
                    nodeToLayer.set(node.id, layer);
                    if (!layers[layer]) layers[layer] = [];
                    layers[layer].push(node);
                    changed = true;
                }
            }
        });
    }
    
    // 为每层的节点分配坐标
    layers.forEach((layerNodes, layerIndex) => {
        const layerHeight = layerIndex * nodeSpacing;
        const nodeCount = layerNodes.length;
        const layerWidth = (nodeCount - 1) * nodeSpacing;
        const startX = -layerWidth / 2;
        
        layerNodes.forEach((node, index) => {
            node.x = startX + index * nodeSpacing;
            node.y = layerHeight;
        });
    });
    
    return layoutData;
}

/**
 * 径向布局 - 从中心向外辐射
 */
function radialLayout(layoutData, options) {
    const { nodeSpacing = 150 } = options;
    const nodes = layoutData.nodes;
    
    // 找到起始节点（中心）
    const startNode = nodes.find(n => !n.dependencies || n.dependencies.length === 0);
    if (startNode) {
        startNode.x = 0;
        startNode.y = 0;
    }
    
    // 计算每个节点的层级（距离中心的距离）
    const nodeToLevel = new Map();
    nodeToLevel.set(startNode.id, 0);
    
    let changed = true;
    let maxIterations = 100;
    while (changed && maxIterations-- > 0) {
        changed = false;
        nodes.forEach(node => {
            if (!nodeToLevel.has(node.id) && node.dependencies && node.dependencies.length > 0) {
                const depsWithLevel = node.dependencies.filter(depId => nodeToLevel.has(depId));
                if (depsWithLevel.length > 0) {
                    const minDepLevel = Math.min(...depsWithLevel.map(depId => nodeToLevel.get(depId)));
                    nodeToLevel.set(node.id, minDepLevel + 1);
                    changed = true;
                }
            }
        });
    }
    
    // 按层级分组节点
    const levels = new Map();
    nodes.forEach(node => {
        const level = nodeToLevel.get(node.id) || 0;
        if (!levels.has(level)) levels.set(level, []);
        levels.get(level).push(node);
    });
    
    // 为每个层级的节点分配圆形位置
    levels.forEach((levelNodes, level) => {
        const radius = level * nodeSpacing;
        const angleStep = (2 * Math.PI) / levelNodes.length;
        
        levelNodes.forEach((node, index) => {
            if (level === 0) {
                node.x = 0;
                node.y = 0;
            } else {
                const angle = index * angleStep;
                node.x = radius * Math.cos(angle);
                node.y = radius * Math.sin(angle);
            }
        });
    });
    
    return layoutData;
}

/**
 * 蜘蛛网布局 - 类似流放之路2的地图设计
 * 特点：
 * 1. 中心节点清晰，周围节点均匀分布
 * 2. 按层级向外扩展，每层节点数量递增
 * 3. 线条不交叉，路径清晰
 * 4. 节点间距合理，避免重叠
 */
function spiderWebLayout(layoutData, options) {
    const { nodeSpacing = 180 } = options;
    const nodes = layoutData.nodes;
    
    // 找到起始节点（中心）
    const startNode = nodes.find(n => n.type === 'start' || !n.dependencies || n.dependencies.length === 0);
    if (!startNode) {
        console.warn('未找到起始节点，使用第一个节点作为中心');
        startNode = nodes[0];
    }
    
    // 设置中心节点位置
    startNode.x = 0;
    startNode.y = 0;
    
    // 按层级组织节点
    const layers = organizeNodesByLayers(nodes, startNode);
    
    // 为每一层分配位置
    layers.forEach((layerNodes, layerIndex) => {
        if (layerIndex === 0) return; // 跳过中心节点
        
        const radius = layerIndex * nodeSpacing;
        const nodeCount = layerNodes.length;
        
        if (nodeCount === 1) {
            // 单节点：放在正上方
            layerNodes[0].x = 0;
            layerNodes[0].y = -radius;
        } else if (nodeCount <= 6) {
            // 少量节点：均匀分布在圆周上
            const angleStep = (2 * Math.PI) / nodeCount;
            layerNodes.forEach((node, index) => {
                const angle = index * angleStep - Math.PI / 2; // 从顶部开始
                node.x = radius * Math.cos(angle);
                node.y = radius * Math.sin(angle);
            });
        } else {
            // 多节点：使用螺旋分布，避免拥挤
            const spiralFactor = 0.3;
            const angleStep = (2 * Math.PI) / nodeCount * (1 + spiralFactor);
            
            layerNodes.forEach((node, index) => {
                const angle = index * angleStep - Math.PI / 2;
                // 添加螺旋效果，让节点更分散
                const spiralRadius = radius + (index % 3) * nodeSpacing * 0.2;
                node.x = spiralRadius * Math.cos(angle);
                node.y = spiralRadius * Math.sin(angle);
            });
        }
    });
    
    // 优化节点位置，避免重叠
    optimizeNodePositions(nodes, nodeSpacing);
    
    return layoutData;
}

/**
 * 按层级组织节点
 */
function organizeNodesByLayers(nodes, startNode) {
    const layers = [[startNode]];
    const nodeToLayer = new Map();
    nodeToLayer.set(startNode.id, 0);
    
    // 计算每个节点的层级（距离中心的步数）
    let changed = true;
    let maxIterations = 100;
    
    while (changed && maxIterations-- > 0) {
        changed = false;
        nodes.forEach(node => {
            if (nodeToLayer.has(node.id)) return;
            
            if (node.dependencies && node.dependencies.length > 0) {
                // 找到所有已分层的前置节点
                const depsWithLayer = node.dependencies.filter(depId => nodeToLayer.has(depId));
                if (depsWithLayer.length > 0) {
                    // 取最小层级 + 1
                    const minDepLayer = Math.min(...depsWithLayer.map(depId => nodeToLayer.get(depId)));
                    const layer = minDepLayer + 1;
                    
                    nodeToLayer.set(node.id, layer);
                    if (!layers[layer]) layers[layer] = [];
                    layers[layer].push(node);
                    changed = true;
                }
            }
        });
    }
    
    // 处理没有依赖关系的孤立节点
    nodes.forEach(node => {
        if (!nodeToLayer.has(node.id)) {
            const layer = 1; // 放在第一层
            nodeToLayer.set(node.id, layer);
            if (!layers[layer]) layers[layer] = [];
            layers[layer].push(node);
        }
    });
    
    return layers;
}

/**
 * 优化节点位置，避免重叠
 */
function optimizeNodePositions(nodes, minDistance) {
    const maxIterations = 50;
    
    for (let iter = 0; iter < maxIterations; iter++) {
        let hasOverlap = false;
        
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const nodeA = nodes[i];
                const nodeB = nodes[j];
                
                const dx = nodeB.x - nodeA.x;
                const dy = nodeB.y - nodeA.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < minDistance * 0.8) {
                    hasOverlap = true;
                    
                    // 计算推开的方向
                    const pushDistance = (minDistance - distance) / 2;
                    const pushX = (dx / distance) * pushDistance;
                    const pushY = (dy / distance) * pushDistance;
                    
                    // 推开节点
                    nodeA.x -= pushX;
                    nodeA.y -= pushY;
                    nodeB.x += pushX;
                    nodeB.y += pushY;
                }
            }
        }
        
        if (!hasOverlap) break;
    }
}

/**
 * 识别图谱中的主要分支
 */
function identifyBranches(nodes, startNode) {
    const branches = [];
    const visited = new Set();
    
    // 从起始节点开始，深度优先遍历每个分支
    function exploreBranch(nodeId, currentBranch = []) {
        if (visited.has(nodeId)) return;
        
        visited.add(nodeId);
        const node = nodes.find(n => n.id === nodeId);
        if (!node) return;
        
        currentBranch.push(node);
        
        // 找到所有依赖当前节点的节点
        const children = nodes.filter(n => 
            n.dependencies && n.dependencies.includes(nodeId)
        );
        
        if (children.length === 0) {
            // 叶子节点，分支结束
            branches.push([...currentBranch]);
        } else if (children.length === 1) {
            // 继续当前分支
            exploreBranch(children[0].id, currentBranch);
        } else {
            // 分支点，为每个子节点创建新分支
            children.forEach(child => {
                exploreBranch(child.id, [...currentBranch]);
            });
        }
    }
    
    // 从起始节点的所有直接子节点开始
    const startChildren = nodes.filter(n => 
        n.dependencies && n.dependencies.includes(startNode.id)
    );
    
    if (startChildren.length === 0) {
        // 如果没有子节点，尝试其他起始方式
        nodes.forEach(node => {
            if (!node.dependencies || node.dependencies.length === 0) {
                exploreBranch(node.id, []);
            }
        });
    } else {
        startChildren.forEach(child => {
            exploreBranch(child.id, [startNode]);
        });
    }
    
    // 如果没有找到分支，创建一个默认分支
    if (branches.length === 0) {
        branches.push(nodes);
    }
    
    return branches;
}

/**
 * 力导向布局 - 使用物理模拟
 */
function forceDirectedLayout(layoutData, options) {
    const { nodeSpacing = 150, iterations = 100 } = options;
    const nodes = layoutData.nodes;
    
    // 初始化随机位置
    nodes.forEach(node => {
        node.x = (Math.random() - 0.5) * 400;
        node.y = (Math.random() - 0.5) * 400;
        node.vx = 0;
        node.vy = 0;
    });
    
    // 物理模拟参数
    const repulsionStrength = nodeSpacing * nodeSpacing;
    const attractionStrength = 0.1;
    const damping = 0.9;
    
    // 运行模拟
    for (let iteration = 0; iteration < iterations; iteration++) {
        // 计算斥力（所有节点互相排斥）
        for (let i = 0; i < nodes.length; i++) {
            for (let j = i + 1; j < nodes.length; j++) {
                const nodeA = nodes[i];
                const nodeB = nodes[j];
                
                const dx = nodeB.x - nodeA.x;
                const dy = nodeB.y - nodeA.y;
                const distance = Math.sqrt(dx * dx + dy * dy) || 1;
                
                const force = repulsionStrength / (distance * distance);
                const fx = (dx / distance) * force;
                const fy = (dy / distance) * force;
                
                nodeA.vx -= fx;
                nodeA.vy -= fy;
                nodeB.vx += fx;
                nodeB.vy += fy;
            }
        }
        
        // 计算引力（有依赖关系的节点相互吸引）
        nodes.forEach(node => {
            if (node.dependencies) {
                node.dependencies.forEach(depId => {
                    const depNode = nodes.find(n => n.id === depId);
                    if (depNode) {
                        const dx = depNode.x - node.x;
                        const dy = depNode.y - node.y;
                        const distance = Math.sqrt(dx * dx + dy * dy) || 1;
                        
                        const force = distance * attractionStrength;
                        const fx = (dx / distance) * force;
                        const fy = (dy / distance) * force;
                        
                        node.vx += fx;
                        node.vy += fy;
                    }
                });
            }
        });
        
        // 更新位置
        nodes.forEach(node => {
            node.x += node.vx;
            node.y += node.vy;
            node.vx *= damping;
            node.vy *= damping;
        });
    }
    
    // 清理临时属性
    nodes.forEach(node => {
        delete node.vx;
        delete node.vy;
    });
    
    return layoutData;
}

export default {
    defaultGraphData,
    programmingGraphData,
    conversationGraphData,
    getGraphDataByType,
    createCustomGraph,
    validateGraphData,
    autoLayout
};

