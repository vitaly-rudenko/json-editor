import React from 'react';
import './TextEditor.css';
import { debounce } from '../utils/debounce';

export const TextEditor = ({ value: initialValue, onChange, debounceDelay = 0, className = '' }) => {
    const [value, setValue] = React.useState(initialValue);
    const revert = React.useCallback(() => setValue(initialValue), [initialValue]);

    const debouncedChangeDispatch = React.useMemo(() => {
        const callback = (value) => onChange(value, revert);
        return debounceDelay > 0 ? debounce(callback, debounceDelay) : callback;
    }, [debounceDelay, onChange, revert]);

    React.useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    const handleChange = React.useCallback((event) => {
        const value = event.target.value;

        setValue(value);
        debouncedChangeDispatch(value, initialValue);
    }, [setValue, debouncedChangeDispatch, initialValue]);

    return (
        <div className={`text-editor ${className}`}>
            <textarea
                className="text-editor__text-area"
                onChange={handleChange}
                value={value}/>
        </div>
    )
};
