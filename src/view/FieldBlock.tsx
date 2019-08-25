import React, { FunctionComponent } from 'react';
import { FieldType } from '../model/FieldType';
import { Field } from '../model/Field';
import './FieldBlock.css';

const stringify = (field: Field) => {
    if (field.type === FieldType.PRIMITIVE) {
        if (typeof field.value === 'string') {
            return '"' + field.value + '"';
        }

        return String(field.value);
    }

    return field.type === FieldType.ARRAY ? '[' : '{';
};

const levelColors = [0xcfe2f1, 0xc7efba, 0xf9f6a2, 0xf9cc88, 0xffb88f, 0xffc0fa];

type Props = {
    field: Field,
    index?: number,
    className?: string,
    [x: string]: any,
};

export const FieldBlockRaw: FunctionComponent<Props> = ({ field, index = 0, className = '', ...props }, ref) => {
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
};

export const FieldBlock = React.memo(
    React.forwardRef<HTMLDivElement, Props>(FieldBlockRaw)
);
