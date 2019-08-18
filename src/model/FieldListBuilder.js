import { Field } from './Field';
import { FieldList } from './FieldList';

export class FieldListBuilder {
    build() {
        if (Array.isArray(this.source)) {
            throw new Error('Arrays are not supported yet');
        }

        if (!this.isPlainObject(this.source)) {
            throw new Error('Source should be either an array or plain object');
        }

        return new FieldList(this.fromObject(this.source));
    }

    fromArray(array, parentChain = []) {
        const fields = [];
    
        for (const [key, value] of array.entries()) {
            fields.push(
                new Field({
                    key, value, parentChain, isArrayItem: true
                })
            );
    
            if (Array.isArray(value)) {
                fields.push(
                    ...this.fromArray(value, [...parentChain, key])
                );
            }
    
            if (this.isPlainObject(value)) {
                fields.push(
                    ...this.fromObject(value, [...parentChain, key])
                );
            }
        }
    
        return fields;
    };
    
    fromObject(object, parentChain = []) {
        const fields = [];
    
        for (const [key, value] of Object.entries(object)) {
            fields.push(
                new Field({
                    key, value, parentChain,
                })
            );
    
            if (Array.isArray(value)) {
                fields.push(
                    ...this.fromArray(value, [...parentChain, key])
                );
            }
    
            if (this.isPlainObject(value)) {
                fields.push(
                    ...this.fromObject(value, [...parentChain, key])
                );
            }
        }
    
        return fields;
    }

    isPlainObject(value) {
        return typeof value === 'object' && value !== null && !Array.isArray(value);
    }

    setSource(value) {
        this._source = value;
        return this;
    }
    
    /** @returns {object | any[]} */
    get source() {
        return this._source;
    }
}
