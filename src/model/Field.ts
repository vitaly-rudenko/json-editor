import shortid from 'shortid';
import { recognizeType, FieldType } from './FieldType';

export type Key = string | number;
export type ParentChain = Key[];

export class Field {
    id: string;
    parentChain: ParentChain;
    key: Key;
    value: any;
    isArrayItem: boolean;

    constructor(source: {
        id?: string,
        key: Key,
        value: any,
        parentChain?: ParentChain,
        isArrayItem?: boolean
    }) {
        this.id = source.id || shortid();
        this.parentChain = [...source.parentChain || []];
        this.key = source.key;
        this.value = source.value;
        this.isArrayItem = Boolean(source.isArrayItem);
    }

    clone() {
        return new Field({
            id: this.id,
            key: this.key,
            value: this.value,
            parentChain: this.parentChain,
            isArrayItem: this.isArrayItem,
        });
    }

    get isArray() {
        return this.type === FieldType.ARRAY;
    }

    get isObject() {
        return this.type === FieldType.OBJECT;
    }

    get isContainer() {
        return this.isArray || this.isObject;
    }

    get isPrimitive() {
        return this.type === FieldType.PRIMITIVE;
    }

    get type() {
        return recognizeType(this.value);
    }

    get level() {
        return this.parentChain.length;
    }
}
