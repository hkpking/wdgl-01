"use client";

import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronDown, Plus, Edit2, Trash2, Users } from 'lucide-react';
import type { Department } from '@/types/team';
import * as deptService from '@/lib/services/departmentService';

interface DepartmentTreeProps {
    onSelectDepartment?: (dept: Department) => void;
    selectedId?: string | null;
    editable?: boolean;
}

type DeptWithChildren = Department & { children: DeptWithChildren[] };

export default function DepartmentTree({ onSelectDepartment, selectedId, editable = false }: DepartmentTreeProps) {
    const [departments, setDepartments] = useState<Department[]>([]);
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editingName, setEditingName] = useState('');
    const [newDeptParentId, setNewDeptParentId] = useState<string | null>(null);
    const [newDeptName, setNewDeptName] = useState('');

    // 加载部门
    useEffect(() => {
        loadDepartments();
    }, []);

    const loadDepartments = async () => {
        setLoading(true);
        try {
            const data = await deptService.getDepartments();
            setDepartments(data);
        } catch (error) {
            console.error('加载部门失败:', error);
        } finally {
            setLoading(false);
        }
    };

    // 构建树结构
    const buildTree = (): DeptWithChildren[] => {
        return deptService.buildDepartmentTree(departments) as DeptWithChildren[];
    };

    // 切换展开
    const toggleExpand = (id: string) => {
        setExpandedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    // 创建部门
    const handleCreateDept = async () => {
        if (!newDeptName.trim()) return;
        const dept = await deptService.createDepartment(newDeptName.trim(), newDeptParentId || undefined);
        if (dept) {
            setDepartments(prev => [...prev, dept]);
            setNewDeptName('');
            setNewDeptParentId(null);
            if (newDeptParentId) {
                setExpandedIds(prev => new Set([...prev, newDeptParentId]));
            }
        }
    };

    // 更新部门
    const handleUpdateDept = async (id: string) => {
        if (!editingName.trim()) return;
        const updated = await deptService.updateDepartment(id, editingName.trim());
        if (updated) {
            setDepartments(prev => prev.map(d => d.id === id ? updated : d));
            setEditingId(null);
            setEditingName('');
        }
    };

    // 删除部门
    const handleDeleteDept = async (id: string) => {
        if (!confirm('确定要删除此部门吗？子部门也会被删除。')) return;
        const success = await deptService.deleteDepartment(id);
        if (success) {
            setDepartments(prev => prev.filter(d => d.id !== id));
        }
    };

    // 渲染节点
    const renderNode = (node: DeptWithChildren, level: number = 0) => {
        const hasChildren = node.children.length > 0;
        const isExpanded = expandedIds.has(node.id);
        const isSelected = selectedId === node.id;
        const isEditing = editingId === node.id;

        return (
            <div key={node.id}>
                <div
                    className={`flex items-center gap-1 px-2 py-1.5 rounded-lg cursor-pointer group ${isSelected ? 'bg-blue-50 text-blue-700' : 'hover:bg-gray-100'
                        }`}
                    style={{ paddingLeft: `${level * 16 + 8}px` }}
                    onClick={() => {
                        if (!isEditing) {
                            onSelectDepartment?.(node);
                        }
                    }}
                >
                    {/* 展开/收起按钮 */}
                    <button
                        onClick={(e) => {
                            e.stopPropagation();
                            if (hasChildren) toggleExpand(node.id);
                        }}
                        className={`p-0.5 ${hasChildren ? '' : 'invisible'}`}
                    >
                        {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                    </button>

                    {/* 图标 */}
                    <Users size={14} className="text-gray-400" />

                    {/* 名称 */}
                    {isEditing ? (
                        <input
                            type="text"
                            value={editingName}
                            onChange={e => setEditingName(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter') handleUpdateDept(node.id);
                                if (e.key === 'Escape') { setEditingId(null); setEditingName(''); }
                            }}
                            onBlur={() => handleUpdateDept(node.id)}
                            className="flex-1 px-1 py-0.5 text-sm border rounded"
                            autoFocus
                            onClick={e => e.stopPropagation()}
                        />
                    ) : (
                        <span className="flex-1 text-sm truncate">{node.name}</span>
                    )}

                    {/* 操作按钮 */}
                    {editable && !isEditing && (
                        <div className="opacity-0 group-hover:opacity-100 flex gap-1">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setNewDeptParentId(node.id);
                                }}
                                className="p-1 text-gray-400 hover:text-blue-600"
                                title="添加子部门"
                            >
                                <Plus size={12} />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingId(node.id);
                                    setEditingName(node.name);
                                }}
                                className="p-1 text-gray-400 hover:text-blue-600"
                                title="编辑"
                            >
                                <Edit2 size={12} />
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    handleDeleteDept(node.id);
                                }}
                                className="p-1 text-gray-400 hover:text-red-600"
                                title="删除"
                            >
                                <Trash2 size={12} />
                            </button>
                        </div>
                    )}
                </div>

                {/* 子节点 */}
                {isExpanded && node.children.map(child => renderNode(child, level + 1))}

                {/* 新建子部门输入框 */}
                {newDeptParentId === node.id && (
                    <div className="flex gap-2 mt-1" style={{ paddingLeft: `${(level + 1) * 16 + 24}px` }}>
                        <input
                            type="text"
                            value={newDeptName}
                            onChange={e => setNewDeptName(e.target.value)}
                            onKeyDown={e => {
                                if (e.key === 'Enter') handleCreateDept();
                                if (e.key === 'Escape') { setNewDeptParentId(null); setNewDeptName(''); }
                            }}
                            placeholder="新建子部门"
                            className="flex-1 px-2 py-1 text-sm border rounded"
                            autoFocus
                        />
                        <button
                            onClick={handleCreateDept}
                            className="px-2 py-1 text-xs bg-blue-600 text-white rounded"
                        >
                            添加
                        </button>
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return <div className="p-4 text-center text-gray-500 text-sm">加载中...</div>;
    }

    const tree = buildTree();

    return (
        <div className="space-y-1">
            {/* 顶层新建按钮 */}
            {editable && (
                <div className="mb-2">
                    {newDeptParentId === null && !editingId ? (
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={newDeptName}
                                onChange={e => setNewDeptName(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleCreateDept()}
                                placeholder="新建部门"
                                className="flex-1 px-2 py-1.5 text-sm border rounded-lg"
                            />
                            <button
                                onClick={handleCreateDept}
                                disabled={!newDeptName.trim()}
                                className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                添加
                            </button>
                        </div>
                    ) : newDeptParentId !== null && (
                        <button
                            onClick={() => { setNewDeptParentId(null); setNewDeptName(''); }}
                            className="text-xs text-gray-500 hover:text-gray-700"
                        >
                            返回顶层
                        </button>
                    )}
                </div>
            )}

            {/* 部门树 */}
            {tree.length === 0 ? (
                <div className="text-center py-8 text-gray-500 text-sm">
                    暂无部门
                </div>
            ) : (
                tree.map(node => renderNode(node, 0))
            )}
        </div>
    );
}
