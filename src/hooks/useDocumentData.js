import { useState, useEffect, useCallback, useRef } from 'react';
import { useStorage } from '../contexts/StorageContext';
import { DOC_STATUS } from '../utils/constants';
import { htmlToBlocks, blocksToHtml } from '../utils/blockConverter';
import { isPlainText, plainTextToHtml } from '../utils/editor';

export const useDocumentData = (id, currentUser) => {
    const storage = useStorage();
    const [document, setDocument] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 使用 ref 存储 storage，避免作为依赖导致的无限循环
    const storageRef = useRef(storage);
    storageRef.current = storage;

    // 追踪已成功加载的文档 ID，防止重复加载
    const loadedDocIdRef = useRef(null);
    const isLoadingRef = useRef(false);

    const loadDocument = useCallback(async (forceReload = false) => {
        // 基本检查
        if (!id || !currentUser) return;

        // 如果正在加载中，不重复发起请求
        if (isLoadingRef.current) {
            console.log('[LOAD] Already loading, skipping...');
            return;
        }

        // 如果已经成功加载过同一个文档，且不是强制刷新，则跳过
        if (!forceReload && loadedDocIdRef.current === id && document !== null) {
            console.log('[LOAD] Document already loaded, skipping...');
            return;
        }

        isLoadingRef.current = true;
        setLoading(true);
        setError(null);

        try {
            console.log('[LOAD] Loading document:', id);
            const doc = await storageRef.current.getDocument(currentUser.uid, id);

            if (doc) {
                console.log('[LOAD] Document loaded successfully:', doc.id);

                let loadedContent = doc.content || '';

                if (doc.contentType === 'blocks' && Array.isArray(doc.blocks)) {
                    loadedContent = blocksToHtml(doc.blocks);
                } else if (isPlainText(loadedContent)) {
                    loadedContent = plainTextToHtml(loadedContent);
                }

                // 标记这个文档已成功加载
                loadedDocIdRef.current = id;

                setDocument({
                    ...doc,
                    content: loadedContent,
                    lastSaved: doc.updatedAt ? new Date(doc.updatedAt) : (doc.createdAt ? new Date(doc.createdAt) : null)
                });
            } else {
                setError(new Error('Document not found'));
            }
        } catch (err) {
            console.error('[LOAD] Error loading document:', err);
            setError(err);
        } finally {
            setLoading(false);
            isLoadingRef.current = false;
        }
    }, [id, currentUser?.uid, document]);

    // 只在 id 或 currentUser.uid 变化时加载
    // 使用 ref 追踪上一次的值，避免不必要的加载
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
        loadedDocIdRef.current = null; // 清除已加载标记
        loadDocument(true);
    }, [loadDocument]);

    return { document, loading, error, reload, setDocument };
};
