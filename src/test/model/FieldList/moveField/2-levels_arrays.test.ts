import { FieldList } from '../../../../model/FieldList';
import { Field } from '../../../../model/Field';
import { MovementError } from '../../../../model/MovementError';

describe('moveField()', () => {
    describe('2-level structure (arrays)', () => {
        describe('item sharing', () => {
            let fieldList: FieldList;

            beforeEach(() => {
                fieldList = new FieldList([
                    new Field({
                        id: 'field-1',
                        key: 'array-1',
                        value: [],
                    }),
                    new Field({
                        id: 'field-1-1',
                        key: 0,
                        value: 46,
                        parentChain: ['array-1'],
                        isArrayItem: true,
                    }),
                    new Field({
                        id: 'field-1-2',
                        key: 1,
                        value: 'hello world',
                        parentChain: ['array-1'],
                        isArrayItem: true,
                    }),
                    new Field({
                        id: 'field-1-3',
                        key: 2,
                        value: true,
                        parentChain: ['array-1'],
                        isArrayItem: true,
                    }),
                    new Field({
                        id: 'field-2',
                        key: 'jon',
                        value: 'snow',
                    }),
                    new Field({
                        id: 'field-3',
                        key: 'array-2',
                        value: [],
                    }),
                    new Field({
                        id: 'field-3-1',
                        key: 0,
                        value: false,
                        parentChain: ['array-2'],
                        isArrayItem: true,
                    }),
                    new Field({
                        id: 'field-3-2',
                        key: 1,
                        value: 146,
                        parentChain: ['array-2'],
                        isArrayItem: true,
                    }),
                    new Field({
                        id: 'field-4',
                        key: 'array-3',
                        value: [],
                    }),
                ]);
            });

            it('moves items correctly (1)', () => {
                expect(fieldList.moveField('field-1-3', ['field-3-2', 'field-4'])).toBe(true);

                expect(fieldList.fields).toEqual([
                    new Field({
                        id: 'field-1',
                        key: 'array-1',
                        value: [],
                    }),
                    new Field({
                        id: 'field-1-1',
                        key: 0,
                        value: 46,
                        parentChain: ['array-1'],
                        isArrayItem: true,
                    }),
                    new Field({
                        id: 'field-1-2',
                        key: 1,
                        value: 'hello world',
                        parentChain: ['array-1'],
                        isArrayItem: true,
                    }),
                    new Field({
                        id: 'field-2',
                        key: 'jon',
                        value: 'snow',
                    }),
                    new Field({
                        id: 'field-3',
                        key: 'array-2',
                        value: [],
                    }),
                    new Field({
                        id: 'field-3-1',
                        key: 0,
                        value: false,
                        parentChain: ['array-2'],
                        isArrayItem: true,
                    }),
                    new Field({
                        id: 'field-3-2',
                        key: 1,
                        value: 146,
                        parentChain: ['array-2'],
                        isArrayItem: true,
                    }),
                    new Field({
                        id: 'field-1-3',
                        key: 2,
                        value: true,
                        parentChain: ['array-2'],
                        isArrayItem: true,
                    }),
                    new Field({
                        id: 'field-4',
                        key: 'array-3',
                        value: [],
                    }),
                ]);
            });

            it('moves items correctly (2)', () => {
                expect(fieldList.moveField('field-3-1', ['field-1', 'field-1-1'])).toBe(true);

                expect(fieldList.fields).toEqual([
                    new Field({
                        id: 'field-1',
                        key: 'array-1',
                        value: [],
                    }),
                    new Field({
                        id: 'field-3-1',
                        key: 0,
                        value: false,
                        parentChain: ['array-1'],
                        isArrayItem: true,
                    }),
                    new Field({
                        id: 'field-1-1',
                        key: 1,
                        value: 46,
                        parentChain: ['array-1'],
                        isArrayItem: true,
                    }),
                    new Field({
                        id: 'field-1-2',
                        key: 2,
                        value: 'hello world',
                        parentChain: ['array-1'],
                        isArrayItem: true,
                    }),
                    new Field({
                        id: 'field-1-3',
                        key: 3,
                        value: true,
                        parentChain: ['array-1'],
                        isArrayItem: true,
                    }),
                    new Field({
                        id: 'field-2',
                        key: 'jon',
                        value: 'snow',
                    }),
                    new Field({
                        id: 'field-3',
                        key: 'array-2',
                        value: [],
                    }),
                    new Field({
                        id: 'field-3-2',
                        key: 0,
                        value: 146,
                        parentChain: ['array-2'],
                        isArrayItem: true,
                    }),
                    new Field({
                        id: 'field-4',
                        key: 'array-3',
                        value: [],
                    }),
                ]);
            });

            it('moves items correctly (3)', () => {
                expect(fieldList.moveField('field-1-2', ['field-4', null])).toBe(true);

                expect(fieldList.fields).toEqual([
                    new Field({
                        id: 'field-1',
                        key: 'array-1',
                        value: [],
                    }),
                    new Field({
                        id: 'field-1-1',
                        key: 0,
                        value: 46,
                        parentChain: ['array-1'],
                        isArrayItem: true,
                    }),
                    new Field({
                        id: 'field-1-3',
                        key: 1,
                        value: true,
                        parentChain: ['array-1'],
                        isArrayItem: true,
                    }),
                    new Field({
                        id: 'field-2',
                        key: 'jon',
                        value: 'snow',
                    }),
                    new Field({
                        id: 'field-3',
                        key: 'array-2',
                        value: [],
                    }),
                    new Field({
                        id: 'field-3-1',
                        key: 0,
                        value: false,
                        parentChain: ['array-2'],
                        isArrayItem: true,
                    }),
                    new Field({
                        id: 'field-3-2',
                        key: 1,
                        value: 146,
                        parentChain: ['array-2'],
                        isArrayItem: true,
                    }),
                    new Field({
                        id: 'field-4',
                        key: 'array-3',
                        value: [],
                    }),
                    new Field({
                        id: 'field-1-2',
                        key: 0,
                        value: 'hello world',
                        parentChain: ['array-3'],
                        isArrayItem: true,
                    }),
                ]);
            });
        });

        describe('moving an array item to a non-array context', () => {
            let fieldList: FieldList;

            beforeEach(() => {
                fieldList = new FieldList([
                    new Field({
                        id: 'field-1',
                        key: 'array-1',
                        value: [],
                    }),
                    new Field({
                        id: 'field-1-1',
                        key: 0,
                        value: 46,
                        parentChain: ['array-1'],
                        isArrayItem: true,
                    }),
                    new Field({
                        id: 'field-2',
                        key: 'not_lucky_number',
                        value: 64,
                    }),
                    new Field({
                        id: 'field-3',
                        key: 'object',
                        value: {},
                    }),
                    new Field({
                        id: 'field-3-1',
                        key: 'hello',
                        value: 'world',
                        parentChain: ['object'],
                    }),
                ]);
            });

            it('throws a movement error (1)', () => {
                expect(() => fieldList.moveField('field-1-1', [null, 'field-1'])).toThrow(
                    new MovementError({
                        code: 'INVALID_CONTEXT',
                        message: 'Could not move an array item to a non-array context',
                    })
                );
            });

            it('throws a movement error (2)', () => {
                expect(() => fieldList.moveField('field-1-1', ['field-2', 'field-3'])).toThrow(
                    new MovementError({
                        code: 'INVALID_CONTEXT',
                        message: 'Could not move an array item to a non-array context',
                    })
                );
            });

            it('throws a movement error (2)', () => {
                expect(() => fieldList.moveField('field-1-1', ['field-3', 'field-3-1'])).toThrow(
                    new MovementError({
                        code: 'INVALID_CONTEXT',
                        message: 'Could not move an array item to a non-array context',
                    })
                );
            });

            it('throws a movement error (3)', () => {
                expect(() => fieldList.moveField('field-1-1', ['field-3-1', null])).toThrow(
                    new MovementError({
                        code: 'INVALID_CONTEXT',
                        message: 'Could not move an array item to a non-array context',
                    })
                );
            });
        });

        describe('moving a non-array item into an array', () => {
            let fieldList: FieldList;

            beforeEach(() => {
                fieldList = new FieldList([
                    new Field({
                        id: 'field-1',
                        key: 'array-1',
                        value: [],
                    }),
                    new Field({
                        id: 'field-1-1',
                        key: 0,
                        value: 46,
                        parentChain: ['array-1'],
                        isArrayItem: true,
                    }),
                    new Field({
                        id: 'field-1-2',
                        key: 0,
                        value: 64,
                        parentChain: ['array-1'],
                        isArrayItem: true,
                    }),
                    new Field({
                        id: 'field-2',
                        key: 'not_lucky_number',
                        value: 64,
                    }),
                    new Field({
                        id: 'field-3',
                        key: 'object',
                        value: {},
                    }),
                    new Field({
                        id: 'field-4',
                        key: 'hello',
                        value: 'world',
                    }),
                    new Field({
                        id: 'field-5',
                        key: 'is_true',
                        value: false,
                    }),
                ]);
            });

            it('throws a movement error (1)', () => {
                expect(() => fieldList.moveField('field-2', ['field-1', 'field-1-1'])).toThrow(
                    new MovementError({
                        code: 'INVALID_CONTEXT',
                        message: 'Could not move a non-array item into an array',
                    })
                );
            });

            it('throws a movement error (2)', () => {
                expect(() => fieldList.moveField('field-3', ['field-1', 'field-1-1'])).toThrow(
                    new MovementError({
                        code: 'INVALID_CONTEXT',
                        message: 'Could not move a non-array item into an array',
                    })
                );
            });

            it('throws a movement error (3)', () => {
                expect(() => fieldList.moveField('field-4', ['field-1', 'field-1-1'])).toThrow(
                    new MovementError({
                        code: 'INVALID_CONTEXT',
                        message: 'Could not move a non-array item into an array',
                    })
                );
            });

            it('throws a movement error (4)', () => {
                expect(() => fieldList.moveField('field-5', ['field-1', 'field-1-1'])).toThrow(
                    new MovementError({
                        code: 'INVALID_CONTEXT',
                        message: 'Could not move a non-array item into an array',
                    })
                );
            });

            it('throws a movement error (5)', () => {
                expect(() => fieldList.moveField('field-2', ['field-1-1', 'field-1-2'])).toThrow(
                    new MovementError({
                        code: 'INVALID_CONTEXT',
                        message: 'Could not move a non-array item into an array',
                    })
                );
            });

            it('ignores last item of array', () => {
                expect(fieldList.moveField('field-4', ['field-1-2', 'field-2'])).toBe(true);

                expect(fieldList.fields).toEqual([
                    new Field({
                        id: 'field-1',
                        key: 'array-1',
                        value: [],
                    }),
                    new Field({
                        id: 'field-1-1',
                        key: 0,
                        value: 46,
                        parentChain: ['array-1'],
                        isArrayItem: true,
                    }),
                    new Field({
                        id: 'field-1-2',
                        key: 0,
                        value: 64,
                        parentChain: ['array-1'],
                        isArrayItem: true,
                    }),
                    new Field({
                        id: 'field-4',
                        key: 'hello',
                        value: 'world',
                    }),
                    new Field({
                        id: 'field-2',
                        key: 'not_lucky_number',
                        value: 64,
                    }),
                    new Field({
                        id: 'field-3',
                        key: 'object',
                        value: {},
                    }),
                    new Field({
                        id: 'field-5',
                        key: 'is_true',
                        value: false,
                    }),
                ]);
            });

            it('ignores empty array (1)', () => {
                const fieldList = new FieldList([
                    new Field({
                        id: 'field-1',
                        key: 'hello',
                        value: 'world',
                    }),
                    new Field({
                        id: 'field-2',
                        key: 'array-1',
                        value: [],
                    }),
                    new Field({
                        id: 'field-3',
                        key: 'object-1',
                        value: {},
                    }),
                ]);

                expect(fieldList.moveField('field-1', ['field-2', 'field-3'])).toBe(true);

                expect(fieldList.fields).toEqual([
                    new Field({
                        id: 'field-2',
                        key: 'array-1',
                        value: [],
                    }),
                    new Field({
                        id: 'field-1',
                        key: 'hello',
                        value: 'world',
                    }),
                    new Field({
                        id: 'field-3',
                        key: 'object-1',
                        value: {},
                    }),
                ]);
            });

            it('ignores empty array (2)', () => {
                const fieldList = new FieldList([
                    new Field({
                        id: 'field-1',
                        key: 'hello',
                        value: 'world',
                    }),
                    new Field({
                        id: 'field-2',
                        key: 'object-1',
                        value: {},
                    }),
                    new Field({
                        id: 'field-3',
                        key: 'array-1',
                        value: [],
                    }),
                ]);

                expect(fieldList.moveField('field-1', ['field-3', null])).toBe(true);

                expect(fieldList.fields).toEqual([
                    new Field({
                        id: 'field-2',
                        key: 'object-1',
                        value: {},
                    }),
                    new Field({
                        id: 'field-3',
                        key: 'array-1',
                        value: [],
                    }),
                    new Field({
                        id: 'field-1',
                        key: 'hello',
                        value: 'world',
                    }),
                ]);
            });
        });
    });
});
