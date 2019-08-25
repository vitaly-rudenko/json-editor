import { FieldList } from '../../../../model/FieldList';
import { Field } from '../../../../model/Field';

describe('moveField()', () => {
    describe('1-level structure (arrays)', () => {
        let fieldList: FieldList;

        beforeEach(() => {
            fieldList = new FieldList([
                new Field({
                    id: 'field-1',
                    key: 'object-1', value: {},
                }),
                new Field({
                    id: 'field-2',
                    key: 'my_password', value: '123456',
                }),
                new Field({
                    id: 'field-3',
                    key: 'array-1', value: [],
                }),
                new Field({
                    id: 'field-3-1',
                    key: 0, value: 'hello world',
                    parentChain: ['array-1'],
                    isArrayItem: true, 
                }),
                new Field({
                    id: 'field-3-2',
                    key: 1, value: 123,
                    parentChain: ['array-1'],
                    isArrayItem: true, 
                }),
                new Field({
                    id: 'field-3-3',
                    key: 2, value: true,
                    parentChain: ['array-1'],
                    isArrayItem: true, 
                }),
                new Field({
                    id: 'field-4',
                    key: 'object-2', value: {},
                }),
                new Field({
                    id: 'field-5',
                    key: 'array-2', value: [],
                }),
            ]);
        });

        it('moves fields correct (1)', () => {
            expect(
                fieldList.moveField('field-3-1', ['field-3-3', 'field-4'])
            ).toBe(true);

            expect(fieldList.fields).toEqual([
                new Field({
                    id: 'field-1',
                    key: 'object-1', value: {},
                }),
                new Field({
                    id: 'field-2',
                    key: 'my_password', value: '123456',
                }),
                new Field({
                    id: 'field-3',
                    key: 'array-1', value: [],
                }),
                new Field({
                    id: 'field-3-2',
                    key: 0, value: 123,
                    parentChain: ['array-1'],
                    isArrayItem: true, 
                }),
                new Field({
                    id: 'field-3-3',
                    key: 1, value: true,
                    parentChain: ['array-1'],
                    isArrayItem: true, 
                }),
                new Field({
                    id: 'field-3-1',
                    key: 2, value: 'hello world',
                    parentChain: ['array-1'],
                    isArrayItem: true, 
                }),
                new Field({
                    id: 'field-4',
                    key: 'object-2', value: {},
                }),
                new Field({
                    id: 'field-5',
                    key: 'array-2', value: [],
                }),
            ]);
        });

        it('moves fields correct (2)', () => {
            expect(
                fieldList.moveField('field-1', ['field-5', null])
            ).toBe(true);

            expect(fieldList.fields).toEqual([
                new Field({
                    id: 'field-2',
                    key: 'my_password', value: '123456',
                }),
                new Field({
                    id: 'field-3',
                    key: 'array-1', value: [],
                }),
                new Field({
                    id: 'field-3-1',
                    key: 0, value: 'hello world',
                    parentChain: ['array-1'],
                    isArrayItem: true, 
                }),
                new Field({
                    id: 'field-3-2',
                    key: 1, value: 123,
                    parentChain: ['array-1'],
                    isArrayItem: true, 
                }),
                new Field({
                    id: 'field-3-3',
                    key: 2, value: true,
                    parentChain: ['array-1'],
                    isArrayItem: true, 
                }),
                new Field({
                    id: 'field-4',
                    key: 'object-2', value: {},
                }),
                new Field({
                    id: 'field-5',
                    key: 'array-2', value: [],
                }),
                new Field({
                    id: 'field-1',
                    key: 'object-1', value: {},
                }),
            ]);
        });
    });
});
