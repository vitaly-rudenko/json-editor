import { FieldType, recognizeType } from '../../model/FieldType';

describe('recognizeType()', () => {
    it('array', () => {
        expect(recognizeType([])).toBe(FieldType.ARRAY);
        expect(recognizeType([1,2,3])).toBe(FieldType.ARRAY);
        expect(recognizeType(['hello', 'world'])).toBe(FieldType.ARRAY);
    });

    it('object', () => {
        expect(recognizeType({})).toBe(FieldType.OBJECT);
        expect(recognizeType({ hello: 'world' })).toBe(FieldType.OBJECT);
        expect(recognizeType({
            jon: ['snow', 'doe'],
            numbers: [4, 6] }
        )).toBe(FieldType.OBJECT);
    });

    it('primitive', () => {
        expect(recognizeType('hello world')).toBe(FieldType.PRIMITIVE);
        expect(recognizeType(46)).toBe(FieldType.PRIMITIVE);
        expect(recognizeType(true)).toBe(FieldType.PRIMITIVE);
        expect(recognizeType(null)).toBe(FieldType.PRIMITIVE);
    });

    it('invalid', () => {
        // TODO: make these fail
        // expect(() => recognizeType(new Number(123))).toThrowError('Invalid value type');
        // expect(() => recognizeType(new String(123))).toThrowError('Invalid value type');
        expect(() => recognizeType(Symbol.for('jon snow'))).toThrowError('Invalid value type');
        expect(() => recognizeType(function () {})).toThrowError('Invalid value type');
        // expect(() => recognizeType(new Error('fake error'))).toThrowError('Invalid value type');
    });
});
