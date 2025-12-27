/**
 * useUnifiedComments Hook
 * 通用评论功能 Hook，支持文档、表格、PDF等多种内容类型
 */
import { useState, useEffect, useCallback } from 'react';
import * as commentService from '@/lib/services/commentService';
import type { Comment, CommentTarget, CommentRange, CommentAuthor } from '@/lib/services/commentService';

export interface UseCommentsOptions {
    autoLoad?: boolean;  // 是否自动加载评论
}

export interface UseCommentsReturn {
    // 状态
    comments: Comment[];
    loading: boolean;
    error: string | null;

    // 操作
    loadComments: () => Promise<void>;
    addComment: (content: string, range?: CommentRange, mentions?: string[]) => Promise<Comment | null>;
    replyToComment: (commentId: string, content: string, mentions?: string[]) => Promise<boolean>;
    resolveComment: (commentId: string) => Promise<boolean>;
    reopenComment: (commentId: string) => Promise<boolean>;
    deleteComment: (commentId: string) => Promise<boolean>;
}

export function useUnifiedComments(
    target: CommentTarget,
    currentUser: { uid: string; displayName?: string; email?: string } | null,
    options: UseCommentsOptions = {}
): UseCommentsReturn {
    const { autoLoad = true } = options;

    const [comments, setComments] = useState<Comment[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 获取作者信息
    const getAuthor = useCallback((): CommentAuthor | null => {
        if (!currentUser) return null;
        return {
            uid: currentUser.uid,
            name: currentUser.displayName || currentUser.email || '匿名用户'
        };
    }, [currentUser]);

    // 加载评论
    const loadComments = useCallback(async () => {
        if (!target.id) return;

        setLoading(true);
        setError(null);

        try {
            const result = await commentService.getComments(target);
            setComments(result);
        } catch (err) {
            console.error('加载评论失败:', err);
            setError('加载评论失败');
        } finally {
            setLoading(false);
        }
    }, [target.type, target.id]);

    // 自动加载
    useEffect(() => {
        if (autoLoad && target.id) {
            loadComments();
        }
    }, [autoLoad, target.id, loadComments]);

    // 添加评论
    const addComment = useCallback(async (
        content: string,
        range?: CommentRange,
        mentions?: string[]
    ): Promise<Comment | null> => {
        const author = getAuthor();
        if (!author || !currentUser) {
            setError('请先登录');
            return null;
        }

        try {
            const newComment = await commentService.addComment(
                currentUser.uid,
                target,
                content,
                author,
                range,
                mentions
            );

            if (newComment) {
                setComments(prev => [...prev, newComment]);
            }

            return newComment;
        } catch (err) {
            console.error('添加评论失败:', err);
            setError('添加评论失败');
            return null;
        }
    }, [target, currentUser, getAuthor]);

    // 回复评论
    const replyToComment = useCallback(async (
        commentId: string,
        content: string,
        mentions?: string[]
    ): Promise<boolean> => {
        const author = getAuthor();
        if (!author) {
            setError('请先登录');
            return false;
        }

        try {
            const reply = await commentService.replyToComment(commentId, content, author, mentions);

            if (reply) {
                setComments(prev => prev.map(c => {
                    if (c.id === commentId) {
                        return { ...c, replies: [...c.replies, reply] };
                    }
                    return c;
                }));
                return true;
            }
            return false;
        } catch (err) {
            console.error('回复评论失败:', err);
            setError('回复评论失败');
            return false;
        }
    }, [getAuthor]);

    // 解决评论
    const resolveComment = useCallback(async (commentId: string): Promise<boolean> => {
        try {
            const success = await commentService.updateCommentStatus(commentId, 'resolved');

            if (success) {
                setComments(prev => prev.map(c =>
                    c.id === commentId ? { ...c, status: 'resolved' } : c
                ));
            }
            return success;
        } catch (err) {
            console.error('解决评论失败:', err);
            setError('解决评论失败');
            return false;
        }
    }, []);

    // 重新打开评论
    const reopenComment = useCallback(async (commentId: string): Promise<boolean> => {
        try {
            const success = await commentService.updateCommentStatus(commentId, 'open');

            if (success) {
                setComments(prev => prev.map(c =>
                    c.id === commentId ? { ...c, status: 'open' } : c
                ));
            }
            return success;
        } catch (err) {
            console.error('重新打开评论失败:', err);
            setError('重新打开评论失败');
            return false;
        }
    }, []);

    // 删除评论
    const deleteComment = useCallback(async (commentId: string): Promise<boolean> => {
        try {
            const success = await commentService.deleteComment(commentId);

            if (success) {
                setComments(prev => prev.filter(c => c.id !== commentId));
            }
            return success;
        } catch (err) {
            console.error('删除评论失败:', err);
            setError('删除评论失败');
            return false;
        }
    }, []);

    return {
        comments,
        loading,
        error,
        loadComments,
        addComment,
        replyToComment,
        resolveComment,
        reopenComment,
        deleteComment
    };
}

export default useUnifiedComments;
