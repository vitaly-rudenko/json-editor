import shortid from 'shortid';
import { recognizeType, FieldType } from './FieldType';
import { startsWith, equals } from '../utils/array';

export type Key = string | number;
export type ParentChain = Key[];

type FieldProps = {
    id?: string,
    key: Key,
    value: any,
    parentChain?: ParentChain,
    isArrayItem?: boolean
};

export class Field {
    id: string;
    parentChain: ParentChain;
    key: Key;
    value: any;
    isArrayItem: boolean;

    constructor(props: FieldProps) {
        this.id = props.id || shortid();
        this.parentChain = [...props.parentChain || []];
        this.key = props.key;
        this.value = props.value;
        this.isArrayItem = Boolean(props.isArrayItem);
    }

    clone(props: Partial<FieldProps> = {}) {
        return new Field({
            id: this.id,
            key: this.key,
            value: this.value,
            parentChain: this.parentChain,
            isArrayItem: this.isArrayItem,
            ...props,
        });
    }

    isChildOf(field: Field) {
        return startsWith(this.parentChain, field.chain);
    }

    isSiblingOf(...fields: Field[]) {
        return fields.every(
            f => equals(f.parentChain, this.parentChain)
        );
    }

    equals(field: Field) {
        return this === field || (
            equals(this.chain, field.chain)
            && this.value === field.value
        );
    }

    get chain() {
        return [...this.parentChain, this.key];
    }

    get isArray() {
        return this.type === FieldType.ARRAY;
    }

    get isObject() {
        return this.type === FieldType.OBJECT;
    }

    get isPrimitive() {
        return this.type === FieldType.PRIMITIVE;
    }

    get isContainer() {
        return this.isArray || this.isObject;
    }

    get type() {
        return recognizeType(this.value);
    }

    get level() {
        return this.parentChain.length;
    }
}
