import shortid from 'shortid';
import { isObject } from '../utils/isObject';
import { FieldType } from './FieldType';

export class Field {
    /** @type {string} */ id;
    /** @type {string} */ type;
    /** @type {string[]} */ parentChain;
    /** @type {string} */ key;
    /** @type {any} */ value;

    constructor(source) {
        this.id = source.id || shortid();
        this.type = source.type || (isObject(source.value) ? FieldType.OBJECT : FieldType.PRIMITIVE);
        this.parentChain = source.parentChain;
        this.key = source.key;
        this.value = isObject(source.value) ? undefined : source.value;
    }

    get level() {
        return this.parentChain.length;
    }
}
