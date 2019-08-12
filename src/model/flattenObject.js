import { Field } from './Field';
import { isObject } from '../utils/isObject';

export const flattenObject = (object, parentChain = []) => {
    const fields = [];

    for (const [key, value] of Object.entries(object)) {
        fields.push(
            new Field({
                key, value, parentChain,
            })
        );

        if (isObject(value)) {
            fields.push(
                ...flattenObject(value, [...parentChain, key])
            );
        }
    }

    return fields;
};