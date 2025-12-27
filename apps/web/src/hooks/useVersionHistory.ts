/**
 * useVersionHistory Hook
 * 通用版本历史 Hook，支持文档、表格、PDF等多种内容类型
 */
import { useState, useEffect, useCallback } from 'react';
import * as versionService from '@/lib/services/versionService';
import type { Version, VersionTarget, VersionDiff } from '@/lib/services/versionService';

export interface UseVersionHistoryOptions {
    autoLoad?: boolean;
}

export interface UseVersionHistoryReturn {
    // 状态
    versions: Version[];
    loading: boolean;
    error: string | null;
    currentVersion: Version | null;
    comparing: { v1: Version; v2: Version; diff: VersionDiff } | null;

    // 操作
    loadVersions: () => Promise<void>;
    saveVersion: (content: any, label?: string, metadata?: { title?: string }) => Promise<Version | null>;
    restoreVersion: (versionId: string) => Promise<any>;
    updateLabel: (versionId: string, label: string) => Promise<boolean>;
    deleteVersion: (versionId: string) => Promise<boolean>;
    compareVersions: (v1Id: string, v2Id: string) => Promise<void>;
    clearCompare: () => void;
}

export function useVersionHistory(
    target: VersionTarget,
    currentUser: { uid: string; displayName?: string; email?: string } | null,
    options: UseVersionHistoryOptions = {}
): UseVersionHistoryReturn {
    const { autoLoad = true } = options;

    const [versions, setVersions] = useState<Version[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [currentVersion, setCurrentVersion] = useState<Version | null>(null);
    const [comparing, setComparing] = useState<{ v1: Version; v2: Version; diff: VersionDiff } | null>(null);

    // 加载版本历史
    const loadVersions = useCallback(async () => {
        if (!target.id) return;

        setLoading(true);
        setError(null);

        try {
            const result = await versionService.getVersions(target);
            setVersions(result);
            if (result.length > 0 && !currentVersion) {
                setCurrentVersion(result[0]);
            }
        } catch (err) {
            console.error('加载版本历史失败:', err);
            setError('加载版本历史失败');
        } finally {
            setLoading(false);
        }
    }, [target.type, target.id]);

    // 自动加载
    useEffect(() => {
        if (autoLoad && target.id) {
            loadVersions();
        }
    }, [autoLoad, target.id, loadVersions]);

    // 保存新版本
    const saveVersion = useCallback(async (
        content: any,
        label?: string,
        metadata?: { title?: string }
    ): Promise<Version | null> => {
        if (!currentUser) {
            setError('请先登录');
            return null;
        }

        try {
            const createdBy = {
                uid: currentUser.uid,
                name: currentUser.displayName || currentUser.email || '匿名用户'
            };

            const newVersion = await versionService.saveVersion(
                currentUser.uid,
                target,
                content,
                createdBy,
                label,
                metadata
            );

            if (newVersion) {
                setVersions(prev => [newVersion, ...prev]);
                setCurrentVersion(newVersion);
            }

            return newVersion;
        } catch (err) {
            console.error('保存版本失败:', err);
            setError('保存版本失败');
            return null;
        }
    }, [target, currentUser]);

    // 恢复版本
    const restoreVersion = useCallback(async (versionId: string): Promise<any> => {
        try {
            const version = await versionService.getVersion(versionId);
            if (version) {
                setCurrentVersion(version);
                return version.content;
            }
            return null;
        } catch (err) {
            console.error('恢复版本失败:', err);
            setError('恢复版本失败');
            return null;
        }
    }, []);

    // 更新版本标签
    const updateLabel = useCallback(async (versionId: string, label: string): Promise<boolean> => {
        try {
            const success = await versionService.updateVersionLabel(versionId, label);
            if (success) {
                setVersions(prev => prev.map(v =>
                    v.id === versionId ? { ...v, label } : v
                ));
            }
            return success;
        } catch (err) {
            console.error('更新版本标签失败:', err);
            setError('更新版本标签失败');
            return false;
        }
    }, []);

    // 删除版本
    const deleteVersion = useCallback(async (versionId: string): Promise<boolean> => {
        try {
            const success = await versionService.deleteVersion(versionId);
            if (success) {
                setVersions(prev => prev.filter(v => v.id !== versionId));
                if (currentVersion?.id === versionId) {
                    setCurrentVersion(versions[0] || null);
                }
            }
            return success;
        } catch (err) {
            console.error('删除版本失败:', err);
            setError('删除版本失败');
            return false;
        }
    }, [currentVersion, versions]);

    // 版本对比
    const compareVersions = useCallback(async (v1Id: string, v2Id: string): Promise<void> => {
        try {
            const result = await versionService.compareVersions(v1Id, v2Id);
            if (result) {
                setComparing(result);
            }
        } catch (err) {
            console.error('版本对比失败:', err);
            setError('版本对比失败');
        }
    }, []);

    // 清除对比
    const clearCompare = useCallback(() => {
        setComparing(null);
    }, []);

    return {
        versions,
        loading,
        error,
        currentVersion,
        comparing,
        loadVersions,
        saveVersion,
        restoreVersion,
        updateLabel,
        deleteVersion,
        compareVersions,
        clearCompare
    };
}

export default useVersionHistory;
