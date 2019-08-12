/** @param {Field[]} fields */
export const buildObject = (fields) => {
    const result = {};

    for (const field of fields) {
        let parent = result;

        for (const parentKey of field.parentChain) {
            if (parent[parentKey] === undefined) {
                parent[parentKey] = {};
            }

            parent = parent[parentKey];
        }

        parent[field.key] = field.value === undefined ? {} : field.value;
    }

    return result;
};
