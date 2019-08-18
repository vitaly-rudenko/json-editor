import React, { useState, useCallback, useEffect } from 'react';
import './TextEditor.css';

export const TextEditor = ({ value: initialValue, onChange, className = '' }) => {
    const [value, setValue] = useState(initialValue);
    const [isFocused, setIsFocused] = useState(true);
    const revert = useCallback(() => setValue(initialValue), [initialValue]);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    const handleChange = useCallback((event) => {
        const value = event.target.value;

        setValue(value);
    }, [setValue]);

    const handleFocus = useCallback(() => {
        setIsFocused(true);
    }, [setIsFocused]);

    const handleBlur = useCallback((event) => {
        const value = event.target.value;

        setIsFocused(false);
        
        if (value !== initialValue) {
            onChange(value, revert);
        }
    }, [initialValue, onChange, revert]);

    return (
        <div className={`text-editor ${className}`}>
            <textarea
                className={['text-editor__text-area', isFocused && 'text-editor__text-area--focused'].filter(Boolean).join(' ')}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                value={value}
                autoCapitalize="off"
                autoCorrect="off"
                autoComplete="off"
                spellCheck="false"
            />
            {isFocused && <div className="text-editor__apply-notice">Click outside to apply changes</div>}
        </div>
    )
};
