export const equals = (array1: any[], array2: any[]) => {
    return array1.length === array2.length
        && array1.every((value, i) => array2[i] === value);
}

export const startsWith = (source: any[], search: any[]) => {
    return search.every((value, i) => source[i] === value);
}