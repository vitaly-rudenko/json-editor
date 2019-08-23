import shortid from 'shortid';
import { FieldType } from './FieldType';
import { FieldUtil } from './FieldUtil';

export type Key = string | number;
export type ParentChain = Key[];

export class Field {
    id: string;
    type: string;
    parentChain: ParentChain;
    key: Key;
    value: any;
    isArrayItem: boolean;

    constructor(source: Field | {
        key: Key,
        value: any,
        parentChain?: ParentChain,
        isArrayItem?: boolean
    }) {
        if (source instanceof Field) {
            this.id = source.id;
            this.type = source.type;
            this.parentChain = [...source.parentChain];
            this.key = source.key;
            this.value = source.value;
            this.isArrayItem = source.isArrayItem;
        } else {
            this.id = shortid();
            this.type = FieldUtil.recognizeType(source.value);
            this.parentChain = source.parentChain || [];
            this.key = source.key;
            this.value = this.type === FieldType.PRIMITIVE ? source.value : undefined;
            this.isArrayItem = Boolean(source.isArrayItem);
        }
    }

    get level() {
        return this.parentChain.length;
    }
}
