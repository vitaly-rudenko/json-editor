import { FieldList } from '../../../../model/FieldList';
import { Field } from '../../../../model/Field';

describe('moveField()', () => {
    describe('1-level structure (primitives)', () => {
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
                    key: 'I love SU', value: true,
                }),
            ]);
        });

        it('moves fields correct (1)', () => {
            expect(
                    fieldList.moveField('field-1', ['field-3', null])
                ).toBe(true);

            expect(fieldList.fields).toEqual([
                new Field({
                    id: 'field-2',
                    key: 'lucky_number', value: 46,
                }),
                new Field({
                    id: 'field-3',
                    key: 'I love SU', value: true,
                }),
                new Field({
                    id: 'field-1',
                    key: 'jon', value: 'snow',
                }),
            ]);
        });

        it('moves fields correct (2)', () => {
            expect(
                    fieldList.moveField('field-1', ['field-2', 'field-3'])
                ).toBe(true);

            expect(fieldList.fields).toEqual([
                new Field({
                    id: 'field-2',
                    key: 'lucky_number', value: 46,
                }),
                new Field({
                    id: 'field-1',
                    key: 'jon', value: 'snow',
                }),
                new Field({
                    id: 'field-3',
                    key: 'I love SU', value: true,
                }),
            ]);
        });

        it('moves fields correct (3)', () => {
            expect(
                    fieldList.moveField('field-3', [null, 'field-1'])
                ).toBe(true);

            expect(fieldList.fields).toEqual([
                new Field({
                    id: 'field-3',
                    key: 'I love SU', value: true,
                }),
                new Field({
                    id: 'field-1',
                    key: 'jon', value: 'snow',
                }),
                new Field({
                    id: 'field-2',
                    key: 'lucky_number', value: 46,
                }),
            ]);
        });

        it('moves fields correct (4)', () => {
            expect(
                fieldList.moveField('field-2', ['field-3', null])
            ).toBe(true);

            expect(fieldList.fields).toEqual([
                new Field({
                    id: 'field-1',
                    key: 'jon', value: 'snow',
                }),
                new Field({
                    id: 'field-3',
                    key: 'I love SU', value: true,
                }),
                new Field({
                    id: 'field-2',
                    key: 'lucky_number', value: 46,
                }),
            ]);
        });

        it('moves fields correct (5)', () => {
            expect(
                fieldList.moveField('field-2', [null, 'field-1'])
            ).toBe(true);

            expect(fieldList.fields).toEqual([
                new Field({
                    id: 'field-2',
                    key: 'lucky_number', value: 46,
                }),
                new Field({
                    id: 'field-1',
                    key: 'jon', value: 'snow',
                }),
                new Field({
                    id: 'field-3',
                    key: 'I love SU', value: true,
                }),
            ]);
        });
    });
});
