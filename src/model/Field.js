import shortid from 'shortid';
import { FieldType } from './FieldType';
import { FieldUtil } from './FieldUtil';

export class Field {
    /** @type {string} */ id;
    /** @type {string} */ type;
    /** @type {string[]} */ parentChain;
    /** @type {string} */ key;
    /** @type {any} */ value;
    /** @type {boolean} */ isArrayItem;

    /** @param {Field | { key: string, value: any, parentChain?: string[], isArrayItem?: boolean }} source */
    constructor(source) {
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
