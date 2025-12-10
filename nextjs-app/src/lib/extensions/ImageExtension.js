import Image from '@tiptap/extension-image';
import { ReactNodeViewRenderer } from '@tiptap/react';
import ResizableImage from './ResizableImage';

export default Image.extend({
    addAttributes() {
        return {
            ...this.parent?.(),
            width: {
                default: '100%',
                renderHTML: (attributes) => ({
                    width: attributes.width,
                }),
            },
        };
    },

    addNodeView() {
        return ReactNodeViewRenderer(ResizableImage);
    },
});
