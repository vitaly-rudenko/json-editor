import { FieldList } from '../../../../model/FieldList';
import { Field } from '../../../../model/Field';

describe('moveField()', () => {
    describe('2-level structure (objects)', () => {
        let fieldList: FieldList;

        beforeEach(() => {
            fieldList = new FieldList([
                new Field({
                    id: 'field-1',
                    key: 'jon', value: 'snow',
                }),
                new Field({
                    id: 'field-2',
                    key: 'lucky_object', value: {},
                }),
                new Field({
                    id: 'field-2-1',
                    key: 'lucky_number', value: 46,
                    parentChain: ['lucky_object']
                }),
                new Field({
                    id: 'field-3',
                    key: 'nested-object', value: {},
                }),
                new Field({
                    id: 'field-3-1',
                    key: 'hello', value: 'world',
                    parentChain: ['nested-object']
                }),
                new Field({
                    id: 'field-3-2',
                    key: 'over', value: 9000,
                    parentChain: ['nested-object']
                }),
                new Field({
                    id: 'field-4',
                    key: 'I love SU', value: true,
                }),
                new Field({
                    id: 'field-5',
                    key: 'nested-object-2', value: {}
                }),
                new Field({
                    id: 'field-5-1',
                    key: 'I love tests', value: true,
                    parentChain: ['nested-object-2']
                }),
            ]);
        });

        it('moves fields correct (within first level) (1)', () => {
            expect(
                fieldList.moveField('field-5', ['field-2-1', 'field-3'])
            ).toBe(true);

            expect(fieldList.fields).toEqual([
                new Field({
                    id: 'field-1',
                    key: 'jon', value: 'snow',
                }),
                new Field({
                    id: 'field-2',
                    key: 'lucky_object', value: {},
                }),
                new Field({
                    id: 'field-2-1',
                    key: 'lucky_number', value: 46,
                    parentChain: ['lucky_object']
                }),
                new Field({
                    id: 'field-5',
                    key: 'nested-object-2', value: {}
                }),
                new Field({
                    id: 'field-5-1',
                    key: 'I love tests', value: true,
                    parentChain: ['nested-object-2']
                }),
                new Field({
                    id: 'field-3',
                    key: 'nested-object', value: {},
                }),
                new Field({
                    id: 'field-3-1',
                    key: 'hello', value: 'world',
                    parentChain: ['nested-object']
                }),
                new Field({
                    id: 'field-3-2',
                    key: 'over', value: 9000,
                    parentChain: ['nested-object']
                }),
                new Field({
                    id: 'field-4',
                    key: 'I love SU', value: true,
                }),
            ]);
        });

        it('moves fields correct (from 1 level to 2 level) (2)', () => {
            expect(
                fieldList.moveField('field-5', ['field-2', 'field-2-1'])
            ).toBe(true);

            expect(fieldList.fields).toEqual([
                new Field({
                    id: 'field-1',
                    key: 'jon', value: 'snow',
                }),
                new Field({
                    id: 'field-2',
                    key: 'lucky_object', value: {},
                }),
                new Field({
                    id: 'field-5',
                    key: 'nested-object-2', value: {},
                    parentChain: ['lucky_object']
                }),
                new Field({
                    id: 'field-5-1',
                    key: 'I love tests', value: true,
                    parentChain: ['lucky_object', 'nested-object-2']
                }),
                new Field({
                    id: 'field-2-1',
                    key: 'lucky_number', value: 46,
                    parentChain: ['lucky_object']
                }),
                new Field({
                    id: 'field-3',
                    key: 'nested-object', value: {},
                }),
                new Field({
                    id: 'field-3-1',
                    key: 'hello', value: 'world',
                    parentChain: ['nested-object']
                }),
                new Field({
                    id: 'field-3-2',
                    key: 'over', value: 9000,
                    parentChain: ['nested-object']
                }),
                new Field({
                    id: 'field-4',
                    key: 'I love SU', value: true,
                }),
            ]);
        });
    });
});
