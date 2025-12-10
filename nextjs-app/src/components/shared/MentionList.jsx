/**
 * 用户提及列表组件
 * 在输入 @ 时显示可选用户列表
 */
import React, { forwardRef, useEffect, useImperativeHandle, useState } from 'react';

const MentionList = forwardRef((props, ref) => {
    const [selectedIndex, setSelectedIndex] = useState(0);

    const selectItem = (index) => {
        const item = props.items[index];
        if (item) {
            props.command({ id: item.id, label: item.name });
        }
    };

    const upHandler = () => {
        setSelectedIndex((selectedIndex + props.items.length - 1) % props.items.length);
    };

    const downHandler = () => {
        setSelectedIndex((selectedIndex + 1) % props.items.length);
    };

    const enterHandler = () => {
        selectItem(selectedIndex);
    };

    useEffect(() => setSelectedIndex(0), [props.items]);

    useImperativeHandle(ref, () => ({
        onKeyDown: ({ event }) => {
            if (event.key === 'ArrowUp') {
                upHandler();
                return true;
            }
            if (event.key === 'ArrowDown') {
                downHandler();
                return true;
            }
            if (event.key === 'Enter') {
                enterHandler();
                return true;
            }
            return false;
        },
    }));

    if (!props.items.length) {
        return (
            <div className="mention-list-empty">
                未找到用户
            </div>
        );
    }

    return (
        <div className="mention-list">
            {props.items.map((item, index) => (
                <button
                    key={item.id}
                    className={`mention-item ${index === selectedIndex ? 'is-selected' : ''}`}
                    onClick={() => selectItem(index)}
                >
                    <div className="mention-avatar" style={{ backgroundColor: item.color || '#6B7280' }}>
                        {(item.name || 'U')[0].toUpperCase()}
                    </div>
                    <div className="mention-info">
                        <div className="mention-name">{item.name}</div>
                        {item.email && <div className="mention-email">{item.email}</div>}
                    </div>
                </button>
            ))}
        </div>
    );
});

MentionList.displayName = 'MentionList';

export default MentionList;
