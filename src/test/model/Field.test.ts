import { Field } from '../../model/Field';
import { FieldType } from '../../model/FieldType';

describe('constructor()', () => {
    it('constructs a field from plain object', () => {
        const parentChain = ['parent', 'parent2', 1];

        const field = new Field({
            id: 'fake-id',
            key: 'fake_key',
            value: 'fake value',
            parentChain,
            isArrayItem: true,
        });
        
        expect(field.id).toBe('fake-id');
        expect(field.key).toBe('fake_key');
        expect(field.value).toBe('fake value');
        expect(field.isArrayItem).toBe(true);

        // copies an array
        expect(field.parentChain).not.toBe(parentChain);
        expect(field.parentChain).toEqual(parentChain);
    
        // TODO: additional specs for these
        expect(field.level).toBe(3);
        expect(field.type).toBe(FieldType.PRIMITIVE);
    });
});

describe('clone()', () => {
    it('clones a Field instance', () => {
        const parentChain = ['parent', 'parent2', 1];

        const field = new Field({
            id: 'fake-id',
            key: 'fake_key',
            value: 'fake value',
            parentChain,
            isArrayItem: false,
        }).clone();
        
        expect(field.id).toBe('fake-id');
        expect(field.key).toBe('fake_key');
        expect(field.value).toBe('fake value');
        expect(field.isArrayItem).toBe(false);

        // copies an array
        expect(field.parentChain).not.toBe(parentChain);
        expect(field.parentChain).toEqual(parentChain);
    });
});
