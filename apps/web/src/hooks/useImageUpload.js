import { useState, useRef } from 'react';
import { uploadImage } from '@/lib/editor-utils';

/**
 * 图片上传 Hook
 * 统一处理图片上传逻辑（文件上传和URL输入）
 * 
 * @param {Object} editor - Tiptap editor 实例
 * @param {Object} currentUser - 当前用户对象 { uid: string }
 * @returns {Object} 上传状态和方法
 */
export function useImageUpload(editor, currentUser) {
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef(null);

    /**
     * 处理文件上传
     */
    const handleImageUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file || !editor) return;

        setUploading(true);
        try {
            const url = await uploadImage(file, currentUser?.uid);
            editor.chain().focus().setImage({ src: url }).run();
        } catch (error) {
            console.error("Upload failed:", error);
            alert("图片上传失败");
        } finally {
            setUploading(false);
            // 重置 file input 以允许重复上传同一文件
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    };

    /**
     * 触发文件选择对话框
     */
    const triggerUpload = () => {
        fileInputRef.current?.click();
    };

    /**
     * 通过URL添加图片
     */
    const addImageViaUrl = () => {
        const url = window.prompt('请输入图片 URL:');
        if (url && editor) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    return {
        uploading,
        fileInputRef,
        handleImageUpload,
        triggerUpload,
        addImageViaUrl
    };
}
