import React, { useState } from 'react';
import { User, Check, Trash2, CornerDownRight } from 'lucide-react';
import { format } from 'date-fns';

export default function CommentThread({ comment, currentUser, onReply, onResolve, onDelete, isActive }) {
    const [replyContent, setReplyContent] = useState('');

    const handleSubmitReply = (e) => {
        e.preventDefault();
        if (!replyContent.trim()) return;
        onReply(comment.id, replyContent);
        setReplyContent('');
    };

    return (
        <div className={`bg-white rounded-lg shadow-sm border transition-all ${isActive ? 'border-blue-400 ring-2 ring-blue-100' : 'border-gray-200 hover:border-gray-300'}`}>
            {/* Main Comment */}
            <div className="p-3">
                <div className="flex justify-between items-start mb-2">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-medium">
                            {comment.author?.name?.[0] || 'U'}
                        </div>
                        <div className="text-sm font-medium text-gray-900">{comment.author?.name || 'Unknown'}</div>
                        <div className="text-xs text-gray-400">{format(new Date(comment.createdAt), 'MM/dd HH:mm')}</div>
                    </div>
                    <div className="flex gap-1">
                        <button
                            onClick={() => onResolve(comment.id)}
                            className="p-1 text-gray-400 hover:text-green-600 rounded hover:bg-green-50"
                            title="解决"
                        >
                            <Check size={14} />
                        </button>
                        {currentUser.uid === comment.author?.uid && (
                            <button
                                onClick={() => onDelete(comment.id)}
                                className="p-1 text-gray-400 hover:text-red-600 rounded hover:bg-red-50"
                                title="删除"
                            >
                                <Trash2 size={14} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Quote Context */}
                {comment.quote && (
                    <div className="mb-2 pl-2 border-l-2 border-yellow-400 text-xs text-gray-500 italic truncate">
                        "{comment.quote}"
                    </div>
                )}

                <div className="text-sm text-gray-800 mb-2">{comment.content}</div>
            </div>

            {/* Replies */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="bg-gray-50 p-3 border-t border-gray-100 space-y-3">
                    {comment.replies.map(reply => (
                        <div key={reply.id} className="flex gap-2 items-start">
                            <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 text-[10px] flex-shrink-0 mt-0.5">
                                {reply.author?.name?.[0] || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-baseline gap-2 mb-0.5">
                                    <span className="text-xs font-medium text-gray-900">{reply.author?.name}</span>
                                    <span className="text-[10px] text-gray-400">{format(new Date(reply.createdAt), 'MM/dd HH:mm')}</span>
                                </div>
                                <div className="text-sm text-gray-700 break-words">{reply.content}</div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Reply Input */}
            <div className="p-3 border-t border-gray-100">
                <form onSubmit={handleSubmitReply} className="relative">
                    <input
                        type="text"
                        value={replyContent}
                        onChange={(e) => setReplyContent(e.target.value)}
                        placeholder="回复..."
                        className="w-full text-sm px-3 py-2 pr-8 bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:bg-white focus:border-blue-400 transition-colors"
                    />
                    <button
                        type="submit"
                        disabled={!replyContent.trim()}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 disabled:opacity-30 disabled:hover:text-gray-400"
                    >
                        <CornerDownRight size={14} />
                    </button>
                </form>
            </div>
        </div>
    );
}
