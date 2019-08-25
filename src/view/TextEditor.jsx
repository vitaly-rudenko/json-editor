import React, { useState, useCallback, useEffect, useRef } from 'react';
import './TextEditor.css';

export const TextEditor = ({ value: initialValue, onChange, className = '' }) => {
    const [value, setValue] = useState(initialValue);
    const [isFocused, setIsFocused] = useState(false);
    const selectionRef = useRef({ start: 0, end: 0 });
    const textAreaRef = useRef();
    const revert = useCallback(() => setValue(initialValue), [initialValue]);

    useEffect(() => {
        setValue(initialValue);
    }, [initialValue]);

    // useEffect(() => {
    //     textAreaRef.current.selectionStart = selectionRef.current.start;
    //     textAreaRef.current.selectionEnd = selectionRef.current.end;
    // }, [value]);

    useEffect(() => {
        const handler = (event) => {
            if (event.ctrlKey && event.key === 's') {
                event.preventDefault();

                if (value !== initialValue) {
                    onChange(value, revert);
                }
            }
        };

        window.addEventListener('keydown', handler);
        return () => window.removeEventListener('keydown', handler);
    }, [initialValue, value, onChange, revert]);

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

    const handleKeyDown = useCallback(/** @param {KeyboardEvent} event */ (event) => {
        const target = event.target;
        const value = target.value;

        if (event.key === 'Tab') {
            event.preventDefault();

            const identation = '    ';
            const start = target.selectionStart;
            const end = target.selectionEnd;

            target.value = value.substring(0, start) + identation + value.substring(end);
            target.selectionEnd = start + identation.length; 
        }
    }, []);

    const handleSelect = useCallback((event) => {
        selectionRef.current.start = event.target.selectionStart;
        selectionRef.current.end = event.target.selectionEnd;
    }, [selectionRef]);

    return (
        <div className={`text-editor ${className}`}>
            <textarea
                ref={textAreaRef}
                className={['text-editor__text-area', isFocused && 'text-editor__text-area--focused'].filter(Boolean).join(' ')}
                onChange={handleChange}
                onBlur={handleBlur}
                onFocus={handleFocus}
                value={value}
                onKeyDown={handleKeyDown}
                onSelect={handleSelect}
                autoCapitalize="off"
                autoCorrect="off"
                autoComplete="off"
                spellCheck="false"
            />
            {isFocused && <div className="text-editor__apply-notice">Click outside to apply changes (Ctrl+S)</div>}
        </div>
    )
};
