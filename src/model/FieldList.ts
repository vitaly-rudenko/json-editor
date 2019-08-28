import { Field, Key } from './Field';
import { FieldType } from './FieldType';
import { MovementError } from './MovementError';
import { equals, startsWith } from '../utils/array';

export class FieldList {
    fields: Field[];

    constructor(fields: Field[]) {
        this.fields = [...fields];
    }

    clone() {
        return new FieldList(
            this.fields.map(f => f.clone())
        );
    }

    /**
     * @param sourceId Item to move (field id or index or `null` for start/beginning of the list)
     * @param destinationIds Item to put the moved item after/before (and use it as a sample)
     *                    (field id or index or `null` for start/beginning of the list)
     * @returns `true` when fields have been updated
     */
    moveField(
        sourceId: number | string,
        destinationIds: [string | number | null, string | number | null]
    ) {
        const sourceIndex = typeof sourceId === 'string'
            ? this.indexOf(sourceId)
            : sourceId;
        
        const [prevIndex, nextIndex] = destinationIds
            .map(id => (
                typeof id === 'string' ? this.indexOf(id) :
                typeof id === 'number' ? id : null
            ));

        if (!this.isValidIndex(sourceIndex)) {
            throw new Error('Invalid sourceId argument value');
        }

        if (prevIndex === null && nextIndex === null) {
            throw new Error('At least one of destinationIds values must not be null');
        }

        if (prevIndex !== null && !this.isValidIndex(prevIndex)) {
            throw new Error('Invalid destinationIds[0] argument value');
        }

        if (nextIndex !== null && !this.isValidIndex(nextIndex)) {
            throw new Error('Invalid destinationIds[1] argument value');
        }
        
        if (sourceIndex === prevIndex) {
            return false;
        }

        const source = this.fields[sourceIndex];

        const prev = prevIndex !== null ? this.fields[prevIndex] : null;
        const next = nextIndex !== null ? this.fields[nextIndex] : null;

        const isMovedAfterItsChildren = (
            prev && prev.isChildOf(source)
            && (!next || !next.isChildOf(source))
        );

        if (isMovedAfterItsChildren) {
            return false;
        }

        const $source = source.clone();

        if ($source.isArrayItem) {
            if (prev && prev.isArray) {
                $source.parentChain = prev.chain;
            }
            else if (prev && prev.isArrayItem) {
                $source.parentChain = prev.parentChain;
            }
            else if (next && next.isArrayItem) {
                $source.parentChain = next.parentChain;
            }
            else {
                throw new MovementError({
                    code: 'INVALID_CONTEXT',
                    message: 'Could not move an array item to a non-array context'
                });
            }
        } else if (prev && prev.isObject) {
            if (prev.isChildOf($source)) {
                throw new MovementError({
                    code: 'CYCLIC_NESTING',
                    message: 'Could not move an object inside itself'
                });
            }

            $source.parentChain = prev.chain;
        } else if (prev && next) {
            if ((prev.isArrayItem || prev.isArray) && next.isArrayItem) {
                throw new MovementError({
                    code: 'INVALID_CONTEXT',
                    message: 'Could not move a non-array item into an array'
                });
            }

            const parent = this.getCommonParent(prev, next);

            if (parent) {
                if (parent.equals($source) || parent.isChildOf($source)) {
                    throw new MovementError({
                        code: 'CYCLIC_NESTING',
                        message: 'Could not move an object inside itself'
                    });
                }

                $source.parentChain = parent.chain;
            } else {
                $source.parentChain = [];
            }
        } else {
            $source.parentChain = [];
        }

        if (!$source.isArrayItem) {
            const siblings = this.getSiblings($source);

            if (siblings.some(s => s.key === $source.key)) {
                throw new MovementError({
                    code: 'KEY_OVERLAP',
                    message: 'Could not move the field due to key overlap'
                }); 
            }
        }

        let $fields = [...this.fields];
        $fields.splice(prevIndex !== null ? (prevIndex + 1) : 0, 0, $source);
        $fields.splice($fields.indexOf(source), 1);

        if (source.isContainer) {
            const children = this.getChildren(source);

            $fields = $fields.filter(f => !children.includes(f));

            const $children = children.map(child => (
                child.clone({
                    parentChain: [
                        ...$source.chain,
                        ...child.parentChain.slice(source.level + 1),
                    ]
                })
            ));
    
            $fields.splice($fields.indexOf($source) + 1, 0, ...$children);
        }

        if ($source.isArrayItem) {
            $fields = this.refreshSiblings($source, $fields);

            if (!$source.isSiblingOf(source)) {
                $fields = this.refreshSiblings(source, $fields);
            }
        }

        this.fields = $fields;

        return true;
    }

    refreshSiblings(field: Field, fields = this.fields) {
        const siblings = this.getSiblings(field, { includeSelf: true }, fields);
        
        const $siblings = siblings.map((sibling, i) => (
            sibling.clone({ key: i })
        ));

        const insertionIndex = Math.min(
            ...siblings.map(s => fields.indexOf(s))
        );

        const $fields = fields.filter(f => !siblings.includes(f));
        $fields.splice(insertionIndex, 0, ...$siblings);

        return $fields;
    }
    
    getCommonParent(...fields: Field[]) {
        const chains = fields.map(f => f.parentChain);

        const commonChain = [];
        for (const [i, item] of chains[0].entries()) {
            if (!chains.every(chain => chain[i] === item)) {
                break;
            }

            commonChain.push(item);
        }

        return this.getItemByChain(commonChain);
    }

    getItemByChain(chain: Key[]) {
        if (chain.length === 0) return null;

        const parentChain = chain.slice(0, -1);
        const key = chain[chain.length - 1];

        return this.fields.find(f => (
            f.key === key &&
            equals(f.parentChain, parentChain)
        )) || null;
    }

    getSiblings(field: Field, { includeSelf = false } = {}, fields = this.fields) {
        return fields.filter(
            f => equals(f.parentChain, field.parentChain)
                && (includeSelf || f.id !== field.id)
        );
    }

    getChildren(field: Field, fields = this.fields) {
        if (field.type !== FieldType.OBJECT && field.type !== FieldType.ARRAY) {
            return [];
        }

        const chain = field.chain;
        return fields.filter(
            f => startsWith(f.parentChain, chain)
        );
    }

    indexOf(fieldId: string) {
        return this.fields.findIndex(f => f.id === fieldId);
    }

    isValidIndex(index: number) {
        return index >= 0 && index < this.fields.length;
    }
}
