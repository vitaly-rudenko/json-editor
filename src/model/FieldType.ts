export const FieldType = Object.freeze({
    PRIMITIVE: 'primitive',
    OBJECT: 'object',
    ARRAY: 'array',
});

export const recognizeType = (value: any) => {
    if (Array.isArray(value)) {
        return FieldType.ARRAY;
    }

    if (typeof value === 'object' && value !== null) {
        return FieldType.OBJECT;
    }

    if (
        value === null
        || (typeof value === 'number' && !Number.isNaN(value))
        || typeof value === 'string'
        || typeof value === 'boolean'
    ) {
        return FieldType.PRIMITIVE;
    }

    throw new Error('Invalid value type');
}