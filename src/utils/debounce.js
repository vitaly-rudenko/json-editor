export const debounce = (callback, ms) => {
    let timeout;

    return function() {
        const functionCall = () => callback.apply(this, arguments);

        clearTimeout(timeout);
        timeout = setTimeout(functionCall, ms);
    };
};
