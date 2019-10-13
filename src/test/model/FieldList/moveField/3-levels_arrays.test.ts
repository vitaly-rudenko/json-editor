import { FieldList } from '../../../../model/FieldList';
import { Field } from '../../../../model/Field';
import { MovementError } from '../../../../model/MovementError';

describe('moveField()', () => {
    describe('3-level structure (arrays)', () => {
        describe('item sharing', () => {
            let fieldList: FieldList;

            beforeEach(() => {
                fieldList = new FieldList([
                    new Field({
                        id: 'field-1',
                        key: 'item-1',
                        value: 'jon',
                    }),
                    new Field({
                        id: 'field-2',
                        key: 'array-1',
                        value: [],
                    }),
                        new Field({
                            id: 'field-2-1',
                            key: 0,
                            value: [],
                            parentChain: ['array-1'],
                            isArrayItem: true
                        }),
                            new Field({
                                id: 'field-2-1-1',
                                key: 0,
                                value: 'a',
                                parentChain: ['array-1', 0],
                                isArrayItem: true
                            }),
                            new Field({
                                id: 'field-2-1-2',
                                key: 1,
                                value: 'b',
                                parentChain: ['array-1', 0],
                                isArrayItem: true
                            }),
                        new Field({
                            id: 'field-2-2',
                            key: 1,
                            value: [],
                            parentChain: ['array-1'],
                            isArrayItem: true
                        }),
                            new Field({
                                id: 'field-2-2-1',
                                key: 0,
                                value: 'c',
                                parentChain: ['array-1', 1],
                                isArrayItem: true
                            }),
                            new Field({
                                id: 'field-2-2-2',
                                key: 1,
                                value: 'd',
                                parentChain: ['array-1', 1],
                                isArrayItem: true
                            }),
                    new Field({
                        id: 'field-3',
                        key: 'item-2',
                        value: 'snow',
                    }),
                ]);
            });

            it('moves array item correctly (1)', () => {
                expect(fieldList.moveField('field-2-2', ['field-2', 'field-2-1'])).toBe(true);

                expect(fieldList.fields).toEqual([
                    new Field({
                        id: 'field-1',
                        key: 'item-1',
                        value: 'jon',
                    }),
                    new Field({
                        id: 'field-2',
                        key: 'array-1',
                        value: [],
                    }),
                        new Field({
                            id: 'field-2-2',
                            key: 0,
                            value: [],
                            parentChain: ['array-1'],
                            isArrayItem: true
                        }),
                            new Field({
                                id: 'field-2-2-1',
                                key: 0,
                                value: 'c',
                                parentChain: ['array-1', 0],
                                isArrayItem: true
                            }),
                            new Field({
                                id: 'field-2-2-2',
                                key: 1,
                                value: 'd',
                                parentChain: ['array-1', 0],
                                isArrayItem: true
                            }),
                        new Field({
                            id: 'field-2-1',
                            key: 1,
                            value: [],
                            parentChain: ['array-1'],
                            isArrayItem: true
                        }),
                            new Field({
                                id: 'field-2-1-1',
                                key: 0,
                                value: 'a',
                                parentChain: ['array-1', 1],
                                isArrayItem: true
                            }),
                            new Field({
                                id: 'field-2-1-2',
                                key: 1,
                                value: 'b',
                                parentChain: ['array-1', 1],
                                isArrayItem: true
                            }),
                    new Field({
                        id: 'field-3',
                        key: 'item-2',
                        value: 'snow',
                    }),
                ]);
            });
        });

        describe('moving an array inside of another array', () => {
            let fieldList: FieldList;

            beforeEach(() => {
                fieldList = new FieldList([
                    new Field({
                        id: 'field-1',
                        key: 'item-1',
                        value: 'jon',
                    }),
                    new Field({
                        id: 'field-2',
                        key: 'array-1',
                        value: [],
                    }),
                        new Field({
                            id: 'field-2-1',
                            key: 0,
                            value: 'hello',
                            parentChain: ['array-1'],
                            isArrayItem: true
                        }),
                        new Field({
                            id: 'field-2-2',
                            key: 1,
                            value: [],
                            parentChain: ['array-1'],
                            isArrayItem: true
                        }),
                            new Field({
                                id: 'field-2-2-1',
                                key: 0,
                                value: 'hey there',
                                parentChain: ['array-1', 1],
                                isArrayItem: true
                            }),
                            new Field({
                                id: 'field-2-2-2',
                                key: 1,
                                value: 'hey there',
                                parentChain: ['array-1', 1],
                                isArrayItem: true
                            }),
                        new Field({
                            id: 'field-2-3',
                            key: 2,
                            value: 'world',
                            parentChain: ['array-1'],
                            isArrayItem: true
                        }),
                        new Field({
                            id: 'field-2-4',
                            key: 3,
                            value: '!!!',
                            parentChain: ['array-1'],
                            isArrayItem: true
                        }),
                    new Field({
                        id: 'field-3',
                        key: 'item-2',
                        value: 'snow',
                    }),
                    new Field({
                        id: 'field-4',
                        key: 'item-3',
                        value: 'quick brown fox',
                    }),
                ]);
            });

            it('moves array item correctly (1)', () => {
                fieldList.moveField(
                    'field-2-2',
                    ['field-2-3', 'field-2-4'],
                );

                expect(fieldList.fields).toEqual([
                    new Field({
                        id: 'field-1',
                        key: 'item-1',
                        value: 'jon',
                    }),
                    new Field({
                        id: 'field-2',
                        key: 'array-1',
                        value: [],
                    }),
                        new Field({
                            id: 'field-2-1',
                            key: 0,
                            value: 'hello',
                            parentChain: ['array-1'],
                            isArrayItem: true
                        }),
                        new Field({
                            id: 'field-2-3',
                            key: 1,
                            value: 'world',
                            parentChain: ['array-1'],
                            isArrayItem: true
                        }),
                        new Field({
                            id: 'field-2-2',
                            key: 2,
                            value: [],
                            parentChain: ['array-1'],
                            isArrayItem: true
                        }),
                            new Field({
                                id: 'field-2-2-1',
                                key: 0,
                                value: 'hey there',
                                parentChain: ['array-1', 2],
                                isArrayItem: true
                            }),
                            new Field({
                                id: 'field-2-2-2',
                                key: 1,
                                value: 'hey there',
                                parentChain: ['array-1', 2],
                                isArrayItem: true
                            }),
                        new Field({
                            id: 'field-2-4',
                            key: 3,
                            value: '!!!',
                            parentChain: ['array-1'],
                            isArrayItem: true
                        }),
                    new Field({
                        id: 'field-3',
                        key: 'item-2',
                        value: 'snow',
                    }),
                    new Field({
                        id: 'field-4',
                        key: 'item-3',
                        value: 'quick brown fox',
                    }),
                ]);
            });

            it('throws a movement error when moving array inside of an array', () => {
                expect(() => fieldList.moveField('field-2-2', ['field-2-2-1', 'field-2-2-2'])).toThrow(
                    new MovementError({
                        code: 'CYCLIC_NESTING',
                        message: 'Could not move an array inside itself'
                    })
                );
            });
        });
    });
});
