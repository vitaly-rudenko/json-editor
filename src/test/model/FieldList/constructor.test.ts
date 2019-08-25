import { FieldList } from '../../../model/FieldList';
import { Field } from '../../../model/Field';

describe('constructor()', () => {
    it('constructs a field list', () => {
        const fields = [
            new Field({
                key: 'fake-key',
                value: 'fake-value'
            }),
            new Field({
                key: 'fake-key-2',
                value: 'fake-value-2'
            }),
        ];

        const fieldList = new FieldList(fields);

        expect(fieldList.fields).not.toBe(fields);
        expect(fieldList.fields).toEqual(fields);
    });
});
