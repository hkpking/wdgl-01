import { useState, useEffect, useCallback, useRef } from 'react';
import { useStorage } from '../contexts/StorageContext';
import { blocksToHtml } from '../utils/blockConverter';

export const useAutoSave = (id, currentUser, documentState, isPaused = false) => {
    const storage = useStorage();
    const [saving, setSaving] = useState(false);
    const [lastSaved, setLastSaved] = useState(null);
    const [lastSavedState, setLastSavedState] = useState(null);

    // 使用 ref 存储 storage，避免作为依赖导致的重渲染
    const storageRef = useRef(storage);
    storageRef.current = storage;

    // Initialize lastSavedState when document loads
    useEffect(() => {
        if (documentState && !lastSavedState) {
            setLastSavedState({
                title: documentState.title,
                content: documentState.content
            });
            setLastSaved(documentState.lastSaved);
        }
    }, [documentState, lastSavedState]);

    const handleSave = useCallback(async () => {
        if (!documentState || !documentState.title.trim() || !currentUser) return;

        setSaving(true);
        try {
            const docData = {
                title: documentState.title,
                content: documentState.content,
                status: documentState.status,
                contentType: 'html'
            };

            console.log('[SAVE] Saving document:', id);
            // 使用 await 等待异步操作完成
            await storageRef.current.saveDocument(currentUser.uid, id, docData);

            // Save version history
            await storageRef.current.saveVersion(currentUser.uid, id, {
                title: documentState.title,
                content: documentState.content,
                status: documentState.status
            });

            const now = new Date();
            setLastSaved(now);
            setLastSavedState({
                title: documentState.title,
                content: documentState.content
            });

            console.log('[SAVE] Document saved successfully');
        } catch (error) {
            console.error('[SAVE] Error saving:', error);
            alert(error.message);
        } finally {
            setSaving(false);
        }
    }, [id, currentUser?.uid, documentState]); // 移除 storage 依赖

    // Check if content has changed
    const isDirty = documentState && lastSavedState ? (
        documentState.title !== lastSavedState.title ||
        documentState.content !== lastSavedState.content
    ) : false;

    // Auto-save effect
    useEffect(() => {
        if (!id || isPaused || !isDirty) return;

        const timer = setTimeout(() => {
            handleSave();
        }, 3000);
        return () => clearTimeout(timer);
    }, [id, isPaused, isDirty, handleSave]);

    // Browser close warning
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (isDirty) {
                e.preventDefault();
                e.returnValue = '';
            }
        };
        window.addEventListener('beforeunload', handleBeforeUnload);
        return () => window.removeEventListener('beforeunload', handleBeforeUnload);
    }, [isDirty]);

    return { saving, lastSaved, handleSave, isDirty };
};
