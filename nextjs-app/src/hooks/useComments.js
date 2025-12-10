/**
 * useComments Hook
 * 管理文档评论的 CRUD 操作
 */
import { useState, useCallback } from 'react';

export function useComments(docId, currentUser, storage) {
    const [comments, setComments] = useState([]);
    const [isCommentSidebarOpen, setIsCommentSidebarOpen] = useState(false);
    const [activeCommentId, setActiveCommentId] = useState(null);
    const [newCommentDraft, setNewCommentDraft] = useState(null);

    // 加载评论
    const loadComments = useCallback(async () => {
        if (!currentUser || !docId) return;
        try {
            const loadedComments = await storage.getComments(currentUser.uid, docId);
            setComments(loadedComments || []);
        } catch (err) {
            console.error('加载评论失败:', err);
            setComments([]);
        }
    }, [currentUser, docId, storage]);

    // 开始添加评论
    const startAddComment = useCallback((editorInstance) => {
        if (!editorInstance) return;
        const { from, to, empty } = editorInstance.state.selection;

        if (empty) {
            alert('请先选择要评论的文本');
            return;
        }

        const quote = editorInstance.state.doc.textBetween(from, to, ' ');
        setIsCommentSidebarOpen(true);
        setNewCommentDraft({ quote, from, to });
    }, []);

    // 提交评论
    const submitComment = useCallback(async (content, editorInstance) => {
        if (!newCommentDraft || !currentUser) return;

        const commentData = {
            docId,
            quote: newCommentDraft.quote,
            content,
            author: {
                uid: currentUser.uid,
                name: currentUser.displayName || currentUser.email
            }
        };

        try {
            const newComment = await storage.addComment(currentUser.uid, docId, commentData);

            if (!newComment) {
                console.error('添加评论失败');
                alert('评论保存失败，请重试');
                return;
            }

            setComments(prev => [...prev, newComment]);

            // Add CommentMark to selected text
            if (editorInstance && newCommentDraft.from && newCommentDraft.to) {
                editorInstance.chain()
                    .focus()
                    .setTextSelection({ from: newCommentDraft.from, to: newCommentDraft.to })
                    .setComment({ commentId: newComment.id })
                    .setTextSelection(newCommentDraft.to)
                    .run();
            }

            setNewCommentDraft(null);
            setActiveCommentId(newComment.id);
        } catch (error) {
            console.error('添加评论失败:', error);
            alert('评论保存失败，请重试');
        }
    }, [newCommentDraft, currentUser, docId, storage]);

    // 回复评论
    const replyToComment = useCallback(async (commentId, content) => {
        if (!currentUser) return;
        const replyData = {
            content,
            author: {
                uid: currentUser.uid,
                name: currentUser.displayName || currentUser.email
            }
        };

        try {
            const newReply = await storage.addReply(currentUser.uid, docId, commentId, replyData);
            if (!newReply) return;

            setComments(prev => prev.map(c => {
                if (c.id === commentId) {
                    return { ...c, replies: [...(c.replies || []), newReply] };
                }
                return c;
            }));
        } catch (error) {
            console.error('添加回复失败:', error);
        }
    }, [currentUser, docId, storage]);

    // 解决评论
    const resolveComment = useCallback(async (commentId) => {
        try {
            const result = await storage.updateCommentStatus(currentUser.uid, docId, commentId, 'resolved');
            if (result) {
                setComments(prev => prev.map(c =>
                    c.id === commentId ? { ...c, status: 'resolved' } : c
                ));
            }
        } catch (error) {
            console.error('更新评论状态失败:', error);
        }
    }, [currentUser, docId, storage]);

    // 删除评论
    const deleteComment = useCallback(async (commentId) => {
        if (window.confirm('确定要删除这条评论吗？')) {
            try {
                await storage.deleteComment(currentUser.uid, docId, commentId);
                setComments(prev => prev.filter(c => c.id !== commentId));
            } catch (error) {
                console.error('删除评论失败:', error);
            }
        }
    }, [currentUser, docId, storage]);

    // 选择评论 (跳转到文档位置)
    const selectComment = useCallback((commentId, editorInstance) => {
        setActiveCommentId(commentId);

        if (!editorInstance) return;

        const { doc } = editorInstance.state;
        let foundPos = null;

        doc.descendants((node, pos) => {
            if (foundPos) return false;

            node.marks.forEach(mark => {
                if (mark.type.name === 'comment' && mark.attrs.commentId === commentId) {
                    foundPos = pos;
                }
            });
        });

        if (foundPos !== null) {
            editorInstance.chain().focus().setTextSelection(foundPos).run();

            const commentElements = document.querySelectorAll(`[data-comment-id="${commentId}"]`);
            commentElements.forEach(el => {
                el.classList.add('active-comment');
                setTimeout(() => el.classList.remove('active-comment'), 2000);
            });
        }
    }, []);

    // 取消评论草稿
    const cancelDraft = useCallback(() => {
        setNewCommentDraft(null);
    }, []);

    // 关闭侧边栏
    const closeSidebar = useCallback(() => {
        setIsCommentSidebarOpen(false);
    }, []);

    return {
        // State
        comments,
        isCommentSidebarOpen,
        setIsCommentSidebarOpen,
        activeCommentId,
        newCommentDraft,

        // Actions
        loadComments,
        startAddComment,
        submitComment,
        replyToComment,
        resolveComment,
        deleteComment,
        selectComment,
        cancelDraft,
        closeSidebar
    };
}
