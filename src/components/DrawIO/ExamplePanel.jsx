import React from 'react';
import { Lightbulb, Workflow, GitBranch, Database, Users, CheckCircle } from 'lucide-react';

/**
 * 示例提示词面板 - 对标 aidiwo 的 chat-example-panel
 * 提供常用的流程图示例，帮助用户快速开始
 */
export default function ExamplePanel({ setInput, onClose }) {
    const examples = [
        {
            icon: <Workflow size={16} />,
            label: '简单流程图',
            prompt: '画一个简单的用户登录流程图，包含：开始 -> 输入用户名密码 -> 验证 -> 成功/失败 -> 结束',
            category: 'basic'
        },
        {
            icon: <GitBranch size={16} />,
            label: '审批流程',
            prompt: '画一个请假审批流程图：员工提交申请 -> 直接主管审批 -> 如果超过3天需要部门经理审批 -> HR备案 -> 完成',
            category: 'business'
        },
        {
            icon: <Database size={16} />,
            label: '系统架构',
            prompt: '画一个简单的三层架构图：前端(React) -> API网关 -> 后端服务 -> 数据库',
            category: 'tech'
        },
        {
            icon: <Users size={16} />,
            label: '泳道图',
            prompt: '画一个跨部门的报销流程泳道图，包含员工、财务、主管三个角色',
            category: 'business'
        },
        {
            icon: <CheckCircle size={16} />,
            label: '决策流程',
            prompt: '画一个订单处理决策流程：接收订单 -> 检查库存 -> 有货则发货，无货则通知客户',
            category: 'basic'
        }
    ];

    const handleClick = (prompt) => {
        setInput(prompt);
        onClose?.();
    };

    return (
        <div className="p-3 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-2 mb-2">
                <Lightbulb size={16} className="text-amber-500" />
                <span className="text-sm font-medium text-gray-700">快速开始</span>
            </div>
            <div className="flex flex-wrap gap-2">
                {examples.map((example, idx) => (
                    <button
                        key={idx}
                        onClick={() => handleClick(example.prompt)}
                        className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs bg-white hover:bg-gray-50 text-gray-700 rounded-md border border-gray-200 transition-colors shadow-sm hover:shadow"
                        title={example.prompt}
                    >
                        <span className="text-blue-500">{example.icon}</span>
                        {example.label}
                    </button>
                ))}
            </div>
            <p className="mt-2 text-xs text-gray-400">
                点击上方示例快速填充，或直接输入你的需求
            </p>
        </div>
    );
}
