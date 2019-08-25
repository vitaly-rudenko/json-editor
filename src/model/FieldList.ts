import { Field, Key } from './Field';
import { FieldType } from './FieldType';
import { MovementError } from './MovementError';

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
    moveField(sourceId: number | string, destinationIds: [string | number | null, string | number | null]) {
        const sourceIndex = typeof sourceId === 'number' ? sourceId : this.indexOf(sourceId);
        
        const precedingIndex = destinationIds[0] === null ? null
            : typeof destinationIds[0] !== 'string' ? destinationIds[0]
            : this.indexOf(destinationIds[0]);

        const followingIndex = destinationIds[1] === null ? null
            : typeof destinationIds[1] !== 'string' ? destinationIds[1]
            : this.indexOf(destinationIds[1]);
        
        if (sourceIndex < 0 || sourceIndex >= this.fields.length) {
            throw new Error('Invalid sourceId argument value');
        }

        if (precedingIndex === null && followingIndex === null) {
            throw new Error('At least one of destinationIds values must not be null');
        }

        if (
            precedingIndex !== null
            && (precedingIndex < 0 || precedingIndex > this.fields.length)
        ) {
            throw new Error('Invalid destinationIds[0] argument value');
        }

        if (
            followingIndex !== null
            && (followingIndex < 0 || followingIndex > this.fields.length)
        ) {
            throw new Error('Invalid destinationIds[1] argument value');
        }

        if (sourceIndex === precedingIndex) {
            return false;
        }

        const source = this.fields[sourceIndex];
        const sourceChildren = [...source.parentChain, source.key];

        const previous = precedingIndex !== null ? this.fields[precedingIndex] : null;
        const next = followingIndex !== null ? this.fields[followingIndex] : null;

        if (
            previous && !next &&
            this.startsWith(previous.parentChain, sourceChildren)
        ) {
            return false;
        }

        const updatedSource = source.clone();

        if (updatedSource.isArrayItem) {
            if (previous && previous.isArray) {
                updatedSource.parentChain = [...previous.parentChain, previous.key];
            } else if (previous && previous.isArrayItem) {
                updatedSource.parentChain = previous.parentChain;
            } else if (next && next.isArrayItem) {
                updatedSource.parentChain = next.parentChain;
            } else {
                throw new MovementError({
                    code: 'BAD_MOVEMENT',
                    message: 'Could not move an array item to a non-array context'
                });
            }
        } else {
            if (previous && previous.isObject) {
                if (this.startsWith(previous.parentChain, sourceChildren)) {
                    throw new MovementError({
                        code: 'BAD_MOVEMENT',
                        message: 'Could not move an object inside itself'
                    });
                }

                updatedSource.parentChain = [...previous.parentChain, previous.key];
            } else if (previous && next) {
                if ((previous.isArrayItem || previous.isArray) && next.isArrayItem) {
                    throw new MovementError({
                        code: 'BAD_MOVEMENT',
                        message: 'Could not move a non-array item into an array'
                    });
                } else if (previous.isArrayItem) {
                    updatedSource.parentChain = next.parentChain;
                } else {
                    updatedSource.parentChain = previous.parentChain;
                }

                const precedingChain = previous.parentChain;
                const followingChain = next.parentChain;
    
                const commonChain = [];
                for (let i = 0; i < Math.min(precedingChain.length, followingChain.length); i++) {
                    if (precedingChain[i] !== followingChain[i]) {
                        break;
                    }
    
                    commonChain.push(precedingChain[i]);
                }

                if (this.startsWith(commonChain, sourceChildren)) {
                    throw new MovementError({
                        code: 'BAD_MOVEMENT',
                        message: 'Could not move an object inside itself'
                    });
                }
    
                updatedSource.parentChain = commonChain;
            } else {
                updatedSource.parentChain = [];
            }
        }

        if (!updatedSource.isArrayItem) {
            const siblings = this.getSiblings(updatedSource);

            if (siblings.some(s => s.key === updatedSource.key)) {
                throw new MovementError({
                    code: 'BAD_MOVEMENT',
                    message: 'Could not move the field due to key overlap'
                }); 
            }
        }

        let updatedFields = [...this.fields];
        updatedFields.splice(
            precedingIndex !== null ? (precedingIndex + 1) : 0,
            0, updatedSource
        );
        updatedFields.splice(updatedFields.indexOf(source), 1);

        if (source.isContainer) {
            const children = this.getChildren(source);

            for (const child of children) {
                updatedFields.splice(updatedFields.indexOf(child), 1);
            }

            const updatedChildren = children.map((child) => {
                const updatedChild = child.clone();

                updatedChild.parentChain = [
                    ...updatedSource.parentChain,
                    updatedSource.key,
                    ...child.parentChain.slice(source.level + 1),
                ];
    
                return updatedChild;
            });
    
            updatedFields.splice(updatedFields.indexOf(updatedSource) + 1, 0, ...updatedChildren);
        }

        if (updatedSource.isArrayItem) {
            if (!this.equals(source.parentChain, updatedSource.parentChain)) {
                updatedFields = this.refreshSiblings(source, updatedFields);
            }
            updatedFields = this.refreshSiblings(updatedSource, updatedFields);
        }

        this.fields = updatedFields;

        return true;
    }

    refreshSiblings(field: Field, fields = this.fields) {
        const siblings = this.getSiblings(field, { includeSelf: true }, fields);

        const updatedFields = [...fields];

        let insertionIndex = Number.POSITIVE_INFINITY;
        for (const sibling of siblings) {
            const index = updatedFields.indexOf(sibling);
            if (index < insertionIndex) {
                insertionIndex = index;
            }

            updatedFields.splice(index, 1);
        }
        
        const updatedSiblings = siblings.map((sibling, i) => {
            const updatedSibling = sibling.clone();
            updatedSibling.key = i;

            return updatedSibling;
        });

        updatedFields.splice(insertionIndex, 0, ...updatedSiblings);

        return updatedFields;
    }

    getParent(field: Field) {
        return this.getItemByChain(field.parentChain);
    }

    getItemByChain(chain: Key[]) {
        if (chain.length === 0) return null;

        const parentChain = chain.slice(0, -1);
        const key = chain[chain.length - 1];

        return this.fields.find(f => (
            f.key === key &&
            this.equals(f.parentChain, parentChain)
        )) || null;
    }

    getSiblings(field: Field, { includeSelf = false } = {}, fields = this.fields) {
        return fields.filter(
            f => this.equals(f.parentChain, field.parentChain) && (includeSelf || f.id !== field.id)
        );
    }

    getChildren(field: Field, fields = this.fields) {
        if (field.type !== FieldType.OBJECT && field.type !== FieldType.ARRAY) {
            return [];
        }

        const chain = [...field.parentChain, field.key];
        return fields.filter(
            f => this.startsWith(f.parentChain, chain)
        );
    }

    equals(array1: any[], array2: any[]) {
        return array1.length === array2.length
            && array1.every((value, i) => array2[i] === value);
    }

    startsWith(source: any[], search: any[]) {
        return search.every((value, i) => source[i] === value);
    }

    indexOf(fieldId: string) {
        return this.fields.findIndex(f => f.id === fieldId);
    }
}
