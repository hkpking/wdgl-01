import { useState, useEffect, useCallback, useRef } from 'react';
import { DOC_STATUS } from '@/lib/constants';
import { isPlainText, plainTextToHtml } from '@/lib/editor-utils';

/**
 * useDocumentData - 加载和管理文档数据
 * @param {string} id - 文档 ID
 * @param {object} currentUser - 当前用户对象
 * @param {object} storageApi - 存储 API (来自 useStorage() 或其他存储实现)
 */
export const useDocumentData = (id, currentUser, storageApi) => {
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 追踪已成功加载的文档 ID，防止重复加载
    const loadedDocIdRef = useRef(null);
    const isLoadingRef = useRef(false);

    const loadDocument = useCallback(async (forceReload = false) => {
        // 基本检查
        if (!id || !currentUser || !storageApi) return;

        // 如果正在加载中，不重复发起请求
        if (isLoadingRef.current) {
            return;
        }

        // 如果已经成功加载过同一个文档，且不是强制刷新，则跳过
        if (!forceReload && loadedDocIdRef.current === id && document !== null) {
            return;
        }

        isLoadingRef.current = true;
        setLoading(true);
        setError(null);

        try {
            const doc = await storageApi.getDocument(currentUser.uid, id);

            if (doc) {

                let loadedContent = doc.content || '';

                if (isPlainText(loadedContent)) {
                    loadedContent = plainTextToHtml(loadedContent);
                }

                // 标记这个文档已成功加载
                loadedDocIdRef.current = id;

                setDocument({
                    id: id,
                    ...doc,
                    content: loadedContent,
                    lastSaved: doc.updatedAt ? new Date(doc.updatedAt) : (doc.createdAt ? new Date(doc.createdAt) : null)
                });
            } else {
                // 创建新文档
                const newDoc = await storageApi.saveDocument(currentUser.uid, id, {
                    title: '',
                    content: '',
                    status: DOC_STATUS.DRAFT
                });
                loadedDocIdRef.current = id;
                setDocument({
                    id: id,
                    title: '',
                    content: '',
                    status: DOC_STATUS.DRAFT,
                    lastSaved: null
                });
            }
        } catch (err) {
            console.error('[LOAD] Error loading document:', err);
            setError(err);
        } finally {
            setLoading(false);
            isLoadingRef.current = false;
        }
    }, [id, currentUser?.uid, document, storageApi]);

    // 只在 id 或 currentUser.uid 变化时加载
    const prevIdRef = useRef(null);
    const prevUserIdRef = useRef(null);

    useEffect(() => {
        const userId = currentUser?.uid;

        // 只有当 id 或 userId 真正变化时才加载
        if (id !== prevIdRef.current || userId !== prevUserIdRef.current) {
            prevIdRef.current = id;
            prevUserIdRef.current = userId;

            // 如果切换到新文档，重置已加载标记
            if (id !== loadedDocIdRef.current) {
                loadedDocIdRef.current = null;
            }

            loadDocument();
        }
    }, [id, currentUser?.uid, loadDocument]);

    // reload 函数：强制重新加载
    const reload = useCallback(() => {
        loadedDocIdRef.current = null;
        loadDocument(true);
    }, [loadDocument]);

    return { document, loading, error, reload, setDocument };
};

