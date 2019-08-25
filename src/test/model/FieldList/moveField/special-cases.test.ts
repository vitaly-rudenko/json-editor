import { FieldList } from '../../../../model/FieldList';
import { Field } from '../../../../model/Field';
import { MovementError } from '../../../../model/MovementError';

describe('moveField()', () => {
    describe('special cases', () => {
        it('moves fields correct (from 1 level to 2 level) (to empty object) (1)', () => {
            const fieldList = new FieldList([
                new Field({
                    id: 'field-1',
                    key: 'jon', value: 'snow',
                }),
                new Field({
                    id: 'field-2',
                    key: 'nested-object', value: {},
                }),
                new Field({
                    id: 'field-2-1',
                    key: 'hello', value: 'world',
                    parentChain: ['nested-object']
                }),
                new Field({
                    id: 'field-3',
                    key: 'I love SU', value: true,
                }),
                new Field({
                    id: 'field-4',
                    key: 'nested-object-2', value: {}
                }),
            ]);
            
            fieldList.moveField('field-1', ['field-4', null]);

            expect(fieldList.fields).toEqual([
                new Field({
                    id: 'field-2',
                    key: 'nested-object', value: {},
                }),
                new Field({
                    id: 'field-2-1',
                    key: 'hello', value: 'world',
                    parentChain: ['nested-object']
                }),
                new Field({
                    id: 'field-3',
                    key: 'I love SU', value: true,
                }),
                new Field({
                    id: 'field-4',
                    key: 'nested-object-2', value: {}
                }),
                new Field({
                    id: 'field-1',
                    key: 'jon', value: 'snow',
                    parentChain: ['nested-object-2']
                }),
            ]);
        });

        it('moves fields correct between two object within first level', () => {
            const fieldList = new FieldList([
                new Field({
                    id: 'field-1',
                    key: 'jon', value: 'snow',
                }),
                new Field({
                    id: 'field-2',
                    key: 'nested-object', value: {},
                }),
                new Field({
                    id: 'field-2-1',
                    key: 'hello', value: 'world',
                    parentChain: ['nested-object']
                }),
                new Field({
                    id: 'field-2-2',
                    key: 'over', value: 9000,
                    parentChain: ['nested-object']
                }),
                new Field({
                    id: 'field-3',
                    key: 'nested-object-2', value: {}
                }),
                new Field({
                    id: 'field-3-1',
                    key: 'I love tests', value: true,
                    parentChain: ['nested-object-2']
                }),
            ]);

            fieldList.moveField('field-1', ['field-2-2', 'field-3']);

            expect(fieldList.fields).toEqual([
                new Field({
                    id: 'field-2',
                    key: 'nested-object', value: {},
                }),
                new Field({
                    id: 'field-2-1',
                    key: 'hello', value: 'world',
                    parentChain: ['nested-object']
                }),
                new Field({
                    id: 'field-2-2',
                    key: 'over', value: 9000,
                    parentChain: ['nested-object']
                }),
                new Field({
                    id: 'field-1',
                    key: 'jon', value: 'snow',
                }),
                new Field({
                    id: 'field-3',
                    key: 'nested-object-2', value: {}
                }),
                new Field({
                    id: 'field-3-1',
                    key: 'I love tests', value: true,
                    parentChain: ['nested-object-2']
                }),
            ]);
        });

        describe('when update is not necessary', () => {
            it('should return false (moving an object to the end)', () => {
                const fieldList = new FieldList([
                    new Field({
                        id: 'field-1',
                        key: 'jon', value: 'snow',
                    }),
                    new Field({
                        id: 'field-2',
                        key: 'nested-object', value: {},
                    }),
                    new Field({
                        id: 'field-2-1',
                        key: 'hello', value: 'world',
                        parentChain: ['nested-object']
                    }),
                ]);
    
                expect(
                    fieldList.moveField('field-2', ['field-2-1', null])
                ).toBe(false);
            });
        });

        describe('when moving objects inside themselves', () => {
            let fieldList;

            beforeEach(() => {
                fieldList = new FieldList([
                    new Field({
                        id: 'field-1',
                        key: 'jon', value: 'snow',
                    }),
                    new Field({
                        id: 'field-2',
                        key: 'nested-object', value: {},
                    }),
                    new Field({
                        id: 'field-2-1',
                        key: 'hello', value: 'world',
                        parentChain: ['nested-object']
                    }),
                    new Field({
                        id: 'field-2-2',
                        key: 'nested-object-2', value: {},
                        parentChain: ['nested-object']
                    }),
                    new Field({
                        id: 'field-2-2-1',
                        key: 'over', value: 'nine thousand',
                        parentChain: ['nested-object', 'nested-object-2']
                    }),
                    new Field({
                        id: 'field-2-2-2',
                        key: 'luck_number', value: 46,
                        parentChain: ['nested-object', 'nested-object-2']
                    }),
                ]);
            });

            it('throws an error (1)', () => {
                expect(
                    () => fieldList.moveField('field-2', ['field-2-1', 'field-2-2'])
                ).toThrow(new MovementError({
                    code: 'BAD_MOVEMENT',
                    message: 'Could not move an object inside itself'
                }));
            });

            it('throws an error (2)', () => {
                expect(
                    () => fieldList.moveField('field-2', ['field-2-2-1', 'field-2-2-2'])
                ).toThrow(new MovementError({
                    code: 'BAD_MOVEMENT',
                    message: 'Could not move an object inside itself'
                }));
            });

            it('throws an error (3)', () => {
                expect(
                    () => fieldList.moveField('field-2-2', ['field-2-2-1', 'field-2-2-2'])
                ).toThrow(new MovementError({
                    code: 'BAD_MOVEMENT',
                    message: 'Could not move an object inside itself'
                }));
            });

            it('throws an error (4)', () => {
                expect(
                    () => fieldList.moveField('field-2', ['field-2-2', 'field-2-2-1'])
                ).toThrow(new MovementError({
                    code: 'BAD_MOVEMENT',
                    message: 'Could not move an object inside itself'
                }));
            });
        });
    });
});
