/**
 * 文档模板数据
 * 预设模板列表，一键创建结构化文档
 */

export const documentTemplates = [
    {
        id: 'blank',
        name: '空白文档',
        description: '从空白开始创建',
        icon: '📄',
        content: '<p></p>',
        category: '基础'
    },
    {
        id: 'meeting-notes',
        name: '会议记录',
        description: '记录会议要点和行动项',
        icon: '📋',
        content: `
            <h1>会议记录</h1>
            <p><strong>日期：</strong>[填写日期]</p>
            <p><strong>参会人员：</strong>[填写参会人]</p>
            <p><strong>会议主题：</strong>[填写主题]</p>
            <hr>
            <h2>议程</h2>
            <ol>
                <li>[议程项 1]</li>
                <li>[议程项 2]</li>
                <li>[议程项 3]</li>
            </ol>
            <h2>讨论要点</h2>
            <p>[记录讨论内容]</p>
            <h2>决策事项</h2>
            <ul>
                <li>[决策 1]</li>
                <li>[决策 2]</li>
            </ul>
            <h2>行动项</h2>
            <table>
                <tr><th>任务</th><th>负责人</th><th>截止日期</th></tr>
                <tr><td>[任务1]</td><td>[负责人]</td><td>[日期]</td></tr>
                <tr><td>[任务2]</td><td>[负责人]</td><td>[日期]</td></tr>
            </table>
        `,
        category: '工作'
    },
    {
        id: 'project-proposal',
        name: '项目方案',
        description: '项目立项提案模板',
        icon: '📊',
        content: `
            <h1>项目方案</h1>
            <h2>1. 项目背景</h2>
            <p>[描述项目背景和必要性]</p>
            <h2>2. 项目目标</h2>
            <ul>
                <li>[目标 1]</li>
                <li>[目标 2]</li>
                <li>[目标 3]</li>
            </ul>
            <h2>3. 实施方案</h2>
            <h3>3.1 技术方案</h3>
            <p>[描述技术实现方案]</p>
            <h3>3.2 时间计划</h3>
            <table>
                <tr><th>阶段</th><th>任务</th><th>时间</th></tr>
                <tr><td>第一阶段</td><td>[任务描述]</td><td>[时间]</td></tr>
                <tr><td>第二阶段</td><td>[任务描述]</td><td>[时间]</td></tr>
            </table>
            <h2>4. 预算估算</h2>
            <table>
                <tr><th>项目</th><th>金额</th><th>说明</th></tr>
                <tr><td>[费用项]</td><td>[金额]</td><td>[说明]</td></tr>
            </table>
            <h2>5. 风险评估</h2>
            <ul>
                <li><strong>风险：</strong>[风险描述] | <strong>应对措施：</strong>[措施]</li>
            </ul>
        `,
        category: '工作'
    },
    {
        id: 'policy-document',
        name: '制度规范',
        description: '企业制度文档模板',
        icon: '📑',
        content: `
            <h1>[制度名称]</h1>
            <h2>第一章 总则</h2>
            <p><strong>第一条</strong> [制度目的]</p>
            <p><strong>第二条</strong> [适用范围]</p>
            <p><strong>第三条</strong> [基本原则]</p>
            <h2>第二章 职责分工</h2>
            <p><strong>第四条</strong> [部门职责]</p>
            <p><strong>第五条</strong> [岗位职责]</p>
            <h2>第三章 工作流程</h2>
            <p><strong>第六条</strong> [流程描述]</p>
            <h2>第四章 监督检查</h2>
            <p><strong>第七条</strong> [检查机制]</p>
            <h2>第五章 附则</h2>
            <p><strong>第八条</strong> 本制度自发布之日起施行。</p>
            <p><strong>第九条</strong> 本制度由[部门]负责解释。</p>
        `,
        category: '制度'
    },
    {
        id: 'weekly-report',
        name: '周报',
        description: '每周工作汇报',
        icon: '📈',
        content: `
            <h1>周报</h1>
            <p><strong>汇报人：</strong>[姓名]</p>
            <p><strong>汇报周期：</strong>[起始日期] - [结束日期]</p>
            <hr>
            <h2>本周完成</h2>
            <ul>
                <li>[完成事项 1]</li>
                <li>[完成事项 2]</li>
                <li>[完成事项 3]</li>
            </ul>
            <h2>下周计划</h2>
            <ul>
                <li>[计划事项 1]</li>
                <li>[计划事项 2]</li>
            </ul>
            <h2>问题&需协调事项</h2>
            <p>[如有问题请填写]</p>
        `,
        category: '工作'
    },
    {
        id: 'technical-doc',
        name: '技术文档',
        description: '技术方案或接口文档',
        icon: '🔧',
        content: `
            <h1>技术文档</h1>
            <h2>1. 概述</h2>
            <p>[系统/功能概述]</p>
            <h2>2. 架构设计</h2>
            <p>[架构说明]</p>
            <h2>3. 接口定义</h2>
            <h3>3.1 [接口名称]</h3>
            <p><strong>请求方式：</strong>GET/POST</p>
            <p><strong>请求路径：</strong>/api/xxx</p>
            <p><strong>请求参数：</strong></p>
            <table>
                <tr><th>参数名</th><th>类型</th><th>必填</th><th>说明</th></tr>
                <tr><td>param1</td><td>string</td><td>是</td><td>[说明]</td></tr>
            </table>
            <p><strong>返回示例：</strong></p>
            <pre><code>{ "code": 0, "data": {} }</code></pre>
            <h2>4. 部署说明</h2>
            <p>[部署步骤]</p>
        `,
        category: '技术'
    }
];

// 按分类分组
export const templateCategories = [
    { id: 'all', name: '全部' },
    { id: '基础', name: '基础' },
    { id: '工作', name: '工作' },
    { id: '制度', name: '制度' },
    { id: '技术', name: '技术' }
];

export default documentTemplates;
