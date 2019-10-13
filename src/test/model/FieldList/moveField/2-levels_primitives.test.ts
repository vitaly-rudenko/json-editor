import { FieldList } from '../../../../model/FieldList';
import { Field } from '../../../../model/Field';

describe('moveField()', () => {
    describe('2-level structure (primitives)', () => {
        let fieldList: FieldList;

        beforeEach(() => {
            fieldList = new FieldList([
                new Field({
                    id: 'field-1',
                    key: 'jon', value: 'snow',
                }),
                new Field({
                    id: 'field-2',
                    key: 'lucky_number', value: 46,
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

        it('moves fields correctly (from 1 level to 2 level) (1)', () => {
            expect(
                fieldList.moveField('field-1', ['field-3-1', 'field-3-2'])
            ).toBe(true);

            expect(fieldList.fields).toEqual([
                new Field({
                    id: 'field-2',
                    key: 'lucky_number', value: 46,
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
                    id: 'field-1',
                    key: 'jon', value: 'snow',
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
        
        it('moves fields correctly (from 1 level to 2 level) (2)', () => {
            expect(
                fieldList.moveField('field-1', ['field-3-2', 'field-4'])
            ).toBe(true);

            expect(fieldList.fields).toEqual([
                new Field({
                    id: 'field-2',
                    key: 'lucky_number', value: 46,
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
                    id: 'field-1',
                    key: 'jon', value: 'snow',
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

        it('moves fields correctly (from 1 level to 2 level) (3)', () => {
            expect(
            fieldList.moveField('field-1', ['field-5-1', null])
        ).toBe(true);

            expect(fieldList.fields).toEqual([
                new Field({
                    id: 'field-2',
                    key: 'lucky_number', value: 46,
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
                new Field({
                    id: 'field-1',
                    key: 'jon', value: 'snow',
                }),
            ]);
        });

        it('moves fields correctly (from 1 level to 2 level) (4)', () => {
            expect(
            fieldList.moveField('field-1', ['field-3', 'field-3-1'])
        ).toBe(true);

            expect(fieldList.fields).toEqual([
                new Field({
                    id: 'field-2',
                    key: 'lucky_number', value: 46,
                }),
                new Field({
                    id: 'field-3',
                    key: 'nested-object', value: {},
                }),
                new Field({
                    id: 'field-1',
                    key: 'jon', value: 'snow',
                    parentChain: ['nested-object']
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

        it('moves fields correctly (from 2 level to 1 level) (1)', () => {
            expect(
            fieldList.moveField('field-3-1', [null, 'field-1'])
        ).toBe(true);

            expect(fieldList.fields).toEqual([
                new Field({
                    id: 'field-3-1',
                    key: 'hello', value: 'world',
                }),
                new Field({
                    id: 'field-1',
                    key: 'jon', value: 'snow',
                }),
                new Field({
                    id: 'field-2',
                    key: 'lucky_number', value: 46,
                }),
                new Field({
                    id: 'field-3',
                    key: 'nested-object', value: {},
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
    });
});
