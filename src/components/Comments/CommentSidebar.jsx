import React, { useState } from 'react';
import { MessageSquarePlus, X } from 'lucide-react';
import CommentThread from './CommentThread';

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
    onSubmitDraft
}) {
    const [filter, setFilter] = useState('open'); // 'open', 'resolved'

    const filteredComments = comments.filter(c => c.status === filter);

    return (
        <div className="w-80 bg-gray-50 border-l border-gray-200 h-full flex flex-col shadow-xl z-30">
            {/* Header */}
            <div className="p-4 border-b border-gray-200 bg-white flex justify-between items-center">
                <h2 className="font-semibold text-gray-700 flex items-center gap-2">
                    <MessageSquarePlus size={18} />
                    评论 ({comments.filter(c => c.status === 'open').length})
                </h2>
                <button
                    onClick={onClose}
                    className="p-1 hover:bg-gray-100 rounded-full text-gray-500"
                >
                    <X size={18} />
                </button>
            </div>

            {/* Filter Tabs */}
            <div className="flex border-b border-gray-200 bg-white">
                <button
                    className={`flex-1 py-2 text-sm font-medium ${filter === 'open' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setFilter('open')}
                >
                    进行中
                </button>
                <button
                    className={`flex-1 py-2 text-sm font-medium ${filter === 'resolved' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setFilter('resolved')}
                >
                    已解决
                </button>
            </div>

            {/* Comments List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {/* New Comment Draft */}
                {newCommentDraft && (
                    <div className="bg-white rounded-lg shadow-md border border-blue-200 p-3 ring-2 ring-blue-100">
                        <div className="text-xs font-medium text-gray-500 mb-2">添加新评论</div>
                        {newCommentDraft.quote && (
                            <div className="mb-2 pl-2 border-l-2 border-yellow-400 text-xs text-gray-500 italic truncate">
                                "{newCommentDraft.quote}"
                            </div>
                        )}
                        <form onSubmit={(e) => {
                            e.preventDefault();
                            const content = e.target.elements.content.value;
                            if (content.trim()) onSubmitDraft(content);
                        }}>
                            <textarea
                                name="content"
                                autoFocus
                                placeholder="输入评论..."
                                className="w-full text-sm p-2 border border-gray-200 rounded mb-2 focus:outline-none focus:border-blue-400 resize-none h-20"
                            />
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    onClick={onCancelDraft}
                                    className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:bg-gray-100 rounded"
                                >
                                    取消
                                </button>
                                <button
                                    type="submit"
                                    className="px-3 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded"
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
                        {filter === 'open' ? '暂无进行中的评论' : '暂无已解决的评论'}
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
                    />
                ))}
            </div>
        </div>
    );
}
