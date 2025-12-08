import React, { useState, useMemo } from 'react';
import { MessageSquarePlus, X, User, CheckCircle, Clock } from 'lucide-react';
import CommentThread from './CommentThread';
import MentionInput from './MentionInput';

export default function CommentSidebar({
    comments,
    currentUser,
    activeCommentId,
    onAddComment,
    onReply,
    onResolve,
    onDelete,
    onClose,
    newCommentDraft,
    onCancelDraft,
    onSubmitDraft,
    onSelectComment,
    users = [] // 協作用户列表，用于 @提及
}) {
    const [filter, setFilter] = useState('all'); // 'all', 'open', 'resolved', 'mine'
    const [commentContent, setCommentContent] = useState(''); // 新评论内容
    const [mentionedUsers, setMentionedUsers] = useState([]); // 被提及的用户

    // 统计信息
    const stats = useMemo(() => {
        const all = comments.length;
        const open = comments.filter(c => c.status === 'open').length;
        const resolved = comments.filter(c => c.status === 'resolved').length;
        const mine = comments.filter(c => c.author?.uid === currentUser?.uid).length;
        return { all, open, resolved, mine };
    }, [comments, currentUser?.uid]);

    // 筛选评论
    const filteredComments = useMemo(() => {
        switch (filter) {
            case 'open':
                return comments.filter(c => c.status === 'open');
            case 'resolved':
                return comments.filter(c => c.status === 'resolved');
            case 'mine':
                return comments.filter(c => c.author?.uid === currentUser?.uid);
            default:
                return comments;
        }
    }, [comments, filter, currentUser?.uid]);

    const filterOptions = [
        { key: 'all', label: '全部', count: stats.all, icon: MessageSquarePlus },
        { key: 'open', label: '进行中', count: stats.open, icon: Clock },
        { key: 'resolved', label: '已解决', count: stats.resolved, icon: CheckCircle },
        { key: 'mine', label: '我的', count: stats.mine, icon: User },
    ];

    return (
        <div className="w-80 bg-gray-50 border-l border-gray-200 h-full flex flex-col shadow-xl z-30">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
                <h2 className="font-semibold text-gray-700 flex items-center gap-2">
                    <MessageSquarePlus size={18} />
                    评论
                    <span className="text-xs font-normal text-gray-400">
                        ({stats.open} 进行中)
                    </span>
                </h2>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-gray-100 rounded-full text-gray-500"
                >
                    <X size={18} />
                </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex border-b border-gray-200 bg-white overflow-x-auto">
                {filterOptions.map(opt => (
                    <button
                        key={opt.key}
                        className={`flex-1 min-w-0 py-2 px-2 text-xs font-medium flex items-center justify-center gap-1 transition
                            ${filter === opt.key
                                ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/50'
                                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                            }`}
                        onClick={() => setFilter(opt.key)}
                    >
                        <opt.icon size={12} />
                        <span className="truncate">{opt.label}</span>
                        <span className={`text-xs ${filter === opt.key ? 'text-blue-500' : 'text-gray-400'}`}>
                            {opt.count}
                        </span>
                    </button>
                ))}
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* New Comment Draft */}
                {newCommentDraft && (
                    <div className="bg-white rounded-lg shadow-md border border-blue-200 p-3 ring-2 ring-blue-100">
                        <div className="text-xs font-medium text-gray-500 mb-2">添加新评论</div>
                        {newCommentDraft.quote && (
                            <div className="mb-2 pl-2 border-l-2 border-yellow-400 text-xs text-gray-500 italic truncate">
                                &quot;{newCommentDraft.quote}&quot;
                            </div>
                        )}
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            if (commentContent.trim()) {
                                onSubmitDraft(commentContent, mentionedUsers);
                                setCommentContent('');
                                setMentionedUsers([]);
                            }
                        }}>
                            <MentionInput
                                value={commentContent}
                                onChange={setCommentContent}
                                users={users}
                                onMention={setMentionedUsers}
                                placeholder="输入评论，使用 @ 提及用户..."
                                className="text-sm p-2 border border-gray-200 rounded mb-2 focus:outline-none focus:border-blue-400"
                                autoFocus
                            />
                            {mentionedUsers.length > 0 && (
                                <div className="flex flex-wrap gap-1 mb-2">
                                    {mentionedUsers.map(user => (
                                        <span
                                            key={user.id}
                                            className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full"
                                        >
                                            @{user.name}
                                        </span>
                                    ))}
                                </div>
                            )}
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        onCancelDraft();
                                        setCommentContent('');
                                        setMentionedUsers([]);
                                    }}
                                    className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    取消
                                </button>
                                <button
                                    type="submit"
                                    disabled={!commentContent.trim()}
                                    className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded disabled:opacity-50"
                                >
                                    评论
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                {/* Existing Comments */}
                {filteredComments.length === 0 && !newCommentDraft && (
                    <div className="text-center text-gray-400 py-8 text-sm">
                        {filter === 'all' && '暂无评论'}
                        {filter === 'open' && '暂无进行中的评论'}
                        {filter === 'resolved' && '暂无已解决的评论'}
                        {filter === 'mine' && '暂无我的评论'}
                    </div>
                )}

                {filteredComments.map(comment => (
                    <CommentThread
                        key={comment.id}
                        comment={comment}
                        currentUser={currentUser}
                        isActive={activeCommentId === comment.id}
                        onReply={onReply}
                        onResolve={onResolve}
                        onDelete={onDelete}
                        onSelect={onSelectComment}
                    />
                ))}
            </div>
        </div>
    );
}
