import { FieldList } from '../../../../model/FieldList';
import { Field } from '../../../../model/Field';

describe('moveField()', () => {
    describe('1-level structure (objects)', () => {
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
                    key: 'object-2', value: {},
                }),
                new Field({
                    id: 'field-4',
                    key: 'object-3', value: {},
                }),
            ]);
        });

        it('moves fields correct (1)', () => {
            fieldList.moveField('field-1', ['field-2', 'field-3']);

            expect(fieldList.fields).toEqual([
                new Field({
                    id: 'field-2',
                    key: 'my_password', value: '123456',
                }),
                new Field({
                    id: 'field-1',
                    key: 'object-1', value: {},
                }),
                new Field({
                    id: 'field-3',
                    key: 'object-2', value: {},
                }),
                new Field({
                    id: 'field-4',
                    key: 'object-3', value: {},
                }),
            ]);
        });

        it('moves fields correct (2)', () => {
            fieldList.moveField('field-1', ['field-3', 'field-4']);

            expect(fieldList.fields).toEqual([
                new Field({
                    id: 'field-2',
                    key: 'my_password', value: '123456',
                }),
                new Field({
                    id: 'field-3',
                    key: 'object-2', value: {},
                }),
                new Field({
                    id: 'field-1',
                    key: 'object-1', value: {},
                    parentChain: ['object-2']
                }),
                new Field({
                    id: 'field-4',
                    key: 'object-3', value: {},
                }),
            ]);
        });

        it('moves fields correct (3)', () => {
            fieldList.moveField('field-1', ['field-4', null]);

            expect(fieldList.fields).toEqual([
                new Field({
                    id: 'field-2',
                    key: 'my_password', value: '123456',
                }),
                new Field({
                    id: 'field-3',
                    key: 'object-2', value: {},
                }),
                new Field({
                    id: 'field-4',
                    key: 'object-3', value: {},
                }),
                new Field({
                    id: 'field-1',
                    key: 'object-1', value: {},
                    parentChain: ['object-3']
                }),
            ]);
        });

        it('moves fields correct (4)', () => {
            fieldList.moveField('field-2', ['field-3', 'field-4']);

            expect(fieldList.fields).toEqual([
                new Field({
                    id: 'field-1',
                    key: 'object-1', value: {},
                }),
                new Field({
                    id: 'field-3',
                    key: 'object-2', value: {},
                }),
                new Field({
                    id: 'field-2',
                    key: 'my_password', value: '123456',
                    parentChain: ['object-2']
                }),
                new Field({
                    id: 'field-4',
                    key: 'object-3', value: {},
                }),
            ]);
        });

        it('moves fields correct (5)', () => {
            fieldList.moveField('field-4', [null, 'field-1']);

            expect(fieldList.fields).toEqual([
                new Field({
                    id: 'field-4',
                    key: 'object-3', value: {},
                }),
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
                    key: 'object-2', value: {},
                }),
            ]);
        });

        it('moves fields correct (6)', () => {
            fieldList.moveField('field-3', ['field-1', 'field-2']);

            expect(fieldList.fields).toEqual([
                new Field({
                    id: 'field-1',
                    key: 'object-1', value: {},
                }),
                new Field({
                    id: 'field-3',
                    key: 'object-2', value: {},
                    parentChain: ['object-1']
                }),
                new Field({
                    id: 'field-2',
                    key: 'my_password', value: '123456',
                }),
                new Field({
                    id: 'field-4',
                    key: 'object-3', value: {},
                }),
            ]);
        });
    });
});
