import React from 'react';
import './FieldBlock.css';
import { FieldType } from '../model/FieldType';

const stringify = (field) => {
    if (field.type === FieldType.PRIMITIVE) {
        if (typeof field.value === 'string') {
            return '"' + field.value + '"';
        }

        return String(field.value);
    }

    return field.type === FieldType.ARRAY ? '[' : '{';
};

const levelColors = [0xcfe2f1, 0xfeffa0, 0xf3d1d4, 0xcfffd0];

export const FieldBlock = React.memo(React.forwardRef(
    /** @param {{ field: Field }} props */
    ({ field, index = 0, onDrag, className = '', ...props }, ref) => {
        return (
            <div
                ref={ref}
                {...props}
                className={`field-block ${className}`}
                style={{
                    ...props.style || {},
                    marginLeft: `${field.level * 16}px`,
                    backgroundColor:
                        '#' + levelColors[field.level % levelColors.length].toString(16)
                }}
            >
                {!field.isArrayItem && `${field.key}:`} {stringify(field)}
            </div>
        );
    }
));
