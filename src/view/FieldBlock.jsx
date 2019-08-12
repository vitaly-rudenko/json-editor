import React from 'react';
import './FieldBlock.css';

const stringify = (value) => {
    if (typeof value === 'string') {
        return '"' + value + '"';
    }

    if (value === undefined) {
        return '{}';
    }

    return String(value);
};

const levelColors = [0xcfe2f1, 0xfeffa0, 0xf3d1d4, 0xcfffd0];

export const FieldBlock = React.forwardRef(
    /** @param {{ field: Field }} props */
    ({ field, index = 0, onDrag, ...props }, ref) => {
        return (
            <div
                ref={ref}
                {...props}
                className="field"
                style={{
                    ...props.style || {},
                    marginLeft: `${field.level * 16}px`,
                    backgroundColor:
                        '#' + levelColors[field.level % levelColors.length].toString(16)
                }}
            >
                {field.key}: {stringify(field.value)}
            </div>
        );
    }
);
