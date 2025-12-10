/**
 * 提及输入组件
 * 支持 @提及用户的输入框，用于评论系统
 */
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { User } from 'lucide-react';

/**
 * @param {object} props
 * @param {string} props.value - 输入值
 * @param {function} props.onChange - 值变化回调
 * @param {function} props.onSubmit - 提交回调
 * @param {string} props.placeholder - 占位文本
 * @param {string} props.className - 额外样式
 * @param {Array} props.users - 可提及的用户列表 [{id, name, email, color}]
 * @param {function} props.onMention - 提及用户回调 (mentionedUsers) => void
 */
export default function MentionInput({
    value,
    onChange,
    onSubmit,
    placeholder = "输入评论...",
    className = "",
    users = [],
    onMention,
    autoFocus = false
}) {
    const inputRef = useRef(null);
    const popupRef = useRef(null);

    const [showSuggestions, setShowSuggestions] = useState(false);
    const [suggestionIndex, setSuggestionIndex] = useState(0);
    const [mentionQuery, setMentionQuery] = useState('');
    const [mentionStartPos, setMentionStartPos] = useState(-1);
    const [mentionedUsers, setMentionedUsers] = useState([]);

    // 过滤匹配的用户
    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(mentionQuery.toLowerCase()) ||
        (user.email && user.email.toLowerCase().includes(mentionQuery.toLowerCase()))
    ).slice(0, 5);

    // 检测 @ 输入
    const handleInput = useCallback((e) => {
        const newValue = e.target.value;
        const cursorPos = e.target.selectionStart;

        onChange(newValue);

        // 查找 @ 符号位置
        const textBeforeCursor = newValue.slice(0, cursorPos);
        const atIndex = textBeforeCursor.lastIndexOf('@');

        if (atIndex !== -1) {
            // 检查 @ 前是否为空格或开头
            const charBefore = atIndex > 0 ? textBeforeCursor[atIndex - 1] : ' ';
            if (charBefore === ' ' || charBefore === '\n' || atIndex === 0) {
                const query = textBeforeCursor.slice(atIndex + 1);
                // 确保查询中没有空格（空格表示提及结束）
                if (!query.includes(' ')) {
                    setMentionQuery(query);
                    setMentionStartPos(atIndex);
                    setShowSuggestions(true);
                    setSuggestionIndex(0);
                    return;
                }
            }
        }

        setShowSuggestions(false);
        setMentionQuery('');
    }, [onChange]);

    // 选择用户
    const selectUser = useCallback((user) => {
        const before = value.slice(0, mentionStartPos);
        const after = value.slice(mentionStartPos + mentionQuery.length + 1);

        const newValue = `${before}@${user.name} ${after}`;
        onChange(newValue);

        // 记录被提及的用户
        if (!mentionedUsers.find(u => u.id === user.id)) {
            const newMentioned = [...mentionedUsers, user];
            setMentionedUsers(newMentioned);
            if (onMention) onMention(newMentioned);
        }

        setShowSuggestions(false);
        setMentionQuery('');

        // 恢复焦点
        setTimeout(() => {
            if (inputRef.current) {
                inputRef.current.focus();
                const newPos = mentionStartPos + user.name.length + 2;
                inputRef.current.setSelectionRange(newPos, newPos);
            }
        }, 0);
    }, [value, mentionStartPos, mentionQuery, mentionedUsers, onChange, onMention]);

    // 键盘导航
    const handleKeyDown = useCallback((e) => {
        if (showSuggestions && filteredUsers.length > 0) {
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                setSuggestionIndex(i => (i + 1) % filteredUsers.length);
                return;
            }
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                setSuggestionIndex(i => (i - 1 + filteredUsers.length) % filteredUsers.length);
                return;
            }
            if (e.key === 'Enter' || e.key === 'Tab') {
                e.preventDefault();
                selectUser(filteredUsers[suggestionIndex]);
                return;
            }
            if (e.key === 'Escape') {
                setShowSuggestions(false);
                return;
            }
        }

        // 普通回车提交
        if (e.key === 'Enter' && !e.shiftKey && !showSuggestions) {
            e.preventDefault();
            if (onSubmit && value.trim()) {
                onSubmit(value, mentionedUsers);
            }
        }
    }, [showSuggestions, filteredUsers, suggestionIndex, selectUser, onSubmit, value, mentionedUsers]);

    // 点击外部关闭建议
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (popupRef.current && !popupRef.current.contains(e.target) &&
                inputRef.current && !inputRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // 自动聚焦
    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
        }
    }, [autoFocus]);

    return (
        <div className="relative">
            <textarea
                ref={inputRef}
                value={value}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                className={`w-full resize-none ${className}`}
                rows={3}
            />

            {/* 提及建议弹窗 */}
            {showSuggestions && filteredUsers.length > 0 && (
                <div
                    ref={popupRef}
                    className="absolute bottom-full left-0 mb-1 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 max-h-48 overflow-y-auto"
                >
                    {filteredUsers.map((user, index) => (
                        <button
                            key={user.id}
                            className={`w-full flex items-center gap-2 px-3 py-2 text-left hover:bg-gray-50 transition-colors ${index === suggestionIndex ? 'bg-blue-50' : ''
                                }`}
                            onClick={() => selectUser(user)}
                        >
                            <div
                                className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-medium"
                                style={{ backgroundColor: user.color || '#6B7280' }}
                            >
                                {(user.name || 'U')[0].toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="text-sm font-medium text-gray-900 truncate">{user.name}</div>
                                {user.email && (
                                    <div className="text-xs text-gray-500 truncate">{user.email}</div>
                                )}
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {/* 空结果提示 */}
            {showSuggestions && filteredUsers.length === 0 && mentionQuery && (
                <div
                    ref={popupRef}
                    className="absolute bottom-full left-0 mb-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-3 text-center"
                >
                    <User size={16} className="inline mr-1 text-gray-400" />
                    <span className="text-sm text-gray-500">未找到用户</span>
                </div>
            )}
        </div>
    );
}
