export const stringify = (value) => {
    if (typeof value === 'string') {
        return '"' + value + '"';
    }

    if (value === undefined) {
        return '{}';
    }

    return String(value);
};
