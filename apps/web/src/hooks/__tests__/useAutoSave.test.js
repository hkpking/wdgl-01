import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useAutoSave } from '../useAutoSave';

// Mock dependencies
vi.mock('@/contexts/StorageContext', () => ({
    useStorage: () => ({
        saveDocument: vi.fn().mockResolvedValue({}),
        saveVersion: vi.fn().mockResolvedValue({})
    })
}));

vi.mock('../../utils/blockConverter', () => ({
    blocksToHtml: vi.fn(blocks => '<p>mock html</p>')
}));

describe('useAutoSave', () => {
    const mockUser = { uid: 'test-user-123' };
    const mockDocId = 'test-doc-id';

    beforeEach(() => {
        vi.useFakeTimers();
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.clearAllMocks();
    });

    it('初始化时 saving 为 false，lastSaved 为 null', () => {
        const { result } = renderHook(() =>
            useAutoSave(mockDocId, mockUser, null, false)
        );

        expect(result.current.saving).toBe(false);
        expect(result.current.lastSaved).toBe(null);
        expect(result.current.isDirty).toBe(false);
    });

    it('当没有文档状态时，isDirty 应为 false', () => {
        const { result } = renderHook(() =>
            useAutoSave(mockDocId, mockUser, null, false)
        );

        expect(result.current.isDirty).toBe(false);
    });

    it('当内容变化时，isDirty 应为 true', () => {
        const initialState = {
            title: 'Test Document',
            content: '<p>Initial content</p>',
            status: 'draft',
            lastSaved: new Date()
        };

        const { result, rerender } = renderHook(
            ({ docState }) => useAutoSave(mockDocId, mockUser, docState, false),
            { initialProps: { docState: initialState } }
        );

        // Wait for initial state to be set
        expect(result.current.isDirty).toBe(false);

        // 模拟内容修改
        const modifiedState = {
            ...initialState,
            content: '<p>Modified content</p>'
        };

        rerender({ docState: modifiedState });

        expect(result.current.isDirty).toBe(true);
    });

    it('当标题变化时，isDirty 应为 true', () => {
        const initialState = {
            title: 'Test Document',
            content: '<p>Content</p>',
            status: 'draft',
            lastSaved: new Date()
        };

        const { result, rerender } = renderHook(
            ({ docState }) => useAutoSave(mockDocId, mockUser, docState, false),
            { initialProps: { docState: initialState } }
        );

        const modifiedState = {
            ...initialState,
            title: 'Modified Title'
        };

        rerender({ docState: modifiedState });

        expect(result.current.isDirty).toBe(true);
    });

    it('isPaused 为 true 时不应触发自动保存', async () => {
        const docState = {
            title: 'Test',
            content: '<p>Test</p>',
            status: 'draft'
        };

        const { result } = renderHook(() =>
            useAutoSave(mockDocId, mockUser, docState, true) // isPaused = true
        );

        // 前进 5 秒（超过自动保存延迟）
        act(() => {
            vi.advanceTimersByTime(5000);
        });

        // 不应该触发保存
        expect(result.current.saving).toBe(false);
    });

    it('handleSave 方法存在且可调用', () => {
        const { result } = renderHook(() =>
            useAutoSave(mockDocId, mockUser, null, false)
        );

        expect(typeof result.current.handleSave).toBe('function');
    });

    it('没有用户时 handleSave 不执行保存', async () => {
        const docState = {
            title: 'Test',
            content: '<p>Test</p>',
            status: 'draft'
        };

        const { result } = renderHook(() =>
            useAutoSave(mockDocId, null, docState, false) // no user
        );

        await act(async () => {
            await result.current.handleSave();
        });

        expect(result.current.saving).toBe(false);
    });

    it('标题为空时 handleSave 不执行保存', async () => {
        const docState = {
            title: '   ', // empty/whitespace title
            content: '<p>Test</p>',
            status: 'draft'
        };

        const { result } = renderHook(() =>
            useAutoSave(mockDocId, mockUser, docState, false)
        );

        await act(async () => {
            await result.current.handleSave();
        });

        expect(result.current.saving).toBe(false);
    });
});
