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
            
            expect(
                fieldList.moveField('field-1', ['field-4', null])
            ).toBe(true);

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

            expect(
                fieldList.moveField('field-1', ['field-2-2', 'field-3'])
            ).toBe(true);

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
            it('should return false (moving an object to the end of its children) (1)', () => {
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

            it('should return false (moving an object to the end of its children) (2)', () => {
                const fieldList = new FieldList([
                    new Field({
                        id: 'field-1',
                        key: 'a', value: '*',
                    }),
                    new Field({
                        id: 'field-2',
                        key: 'b', value: {},
                    }),
                    new Field({
                        id: 'field-2-1',
                        key: 'a', value: '*',
                        parentChain: ['b']
                    }),
                    new Field({
                        id: 'field-2-2',
                        key: 'b', value: {},
                        parentChain: ['b']
                    }),
                    new Field({
                        id: 'field-2-2-1',
                        key: 'a', value: "*",
                        parentChain: ['b', 'b']
                    }),
                    new Field({
                        id: 'field-2-2-2',
                        key: 'b', value: "*",
                        parentChain: ['b', 'b']
                    }),
                    new Field({
                        id: 'field-2-3',
                        key: 'c', value: '*',
                        parentChain: ['b']
                    }),
                    new Field({
                        id: 'field-3',
                        key: 'c', value: '*',
                    }),
                ]);
    
                expect(
                    fieldList.moveField('field-2-2', ['field-2-2-2', 'field-2-3'])
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

        describe('when moving a field to an object with the same field key', () => {
            let fieldList;

            beforeEach(() => {
                fieldList = new FieldList([
                    new Field({
                        id: 'field-1',
                        key: 'a', value: 1,
                    }),
                    new Field({
                        id: 'field-2',
                        key: 'b', value: 2,
                    }),
                    new Field({
                        id: 'field-3',
                        key: 'c', value: {},
                    }),
                    new Field({
                        id: 'field-3-1',
                        key: 'a', value: 1,
                        parentChain: ['c']
                    }),
                    new Field({
                        id: 'field-3-2',
                        key: 'b', value: 2,
                        parentChain: ['c']
                    }),
                    new Field({
                        id: 'field-3-3',
                        key: 'c', value: 3,
                        parentChain: ['c']
                    }),
                    new Field({
                        id: 'field-3-4',
                        key: 'd', value: {},
                        parentChain: ['c']
                    }),
                    new Field({
                        id: 'field-3-4-1',
                        key: 'a', value: 1,
                        parentChain: ['c', 'd']
                    }),
                    new Field({
                        id: 'field-3-4-2',
                        key: 'b', value: 2,
                        parentChain: ['c', 'd']
                    }),
                ]);
            });

            it('throws an error (1)', () => {
                expect(
                    () => fieldList.moveField('field-1', ['field-3', 'field-3-1'])
                ).toThrow(new MovementError({
                    code: 'BAD_MOVEMENT',
                    message: 'Could not move the field due to key overlap'
                }));
            });

            it('throws an error (2)', () => {
                expect(
                    () => fieldList.moveField('field-1', ['field-3-4', 'field-3-4-1'])
                ).toThrow(new MovementError({
                    code: 'BAD_MOVEMENT',
                    message: 'Could not move the field due to key overlap'
                }));
            });

            it('throws an error (3)', () => {
                expect(
                    () => fieldList.moveField('field-3-1', [null, 'field-1'])
                ).toThrow(new MovementError({
                    code: 'BAD_MOVEMENT',
                    message: 'Could not move the field due to key overlap'
                }));
            });

            it('throws an error (4)', () => {
                expect(
                    () => fieldList.moveField('field-3-1', ['field-2', 'field-3'])
                ).toThrow(new MovementError({
                    code: 'BAD_MOVEMENT',
                    message: 'Could not move the field due to key overlap'
                }));
            });

            it('ignores source field itself', () => {
                expect(
                    () => fieldList.moveField('field-1', ['field-3-4-2', null])
                ).not.toThrow();
            });
        });
    });
});
