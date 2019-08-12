import React, { useState, useCallback, useMemo } from 'react';
import { flattenObject } from '../model/flattenObject';
import { buildObject } from '../model/buildObject';
import { FieldList } from './FieldList';
import './App.css';
import { TextEditor } from './TextEditor';

const object = {
    hello: 'world',
    isEnabled: true,
    nested: {
        lorem: 'ipsum',
        secretNumber: 123,
        nested2: {
            jon: 'snow'
        }
    },
    inception: {
        hello2: 'world',
        isEnabled2: true,
        nested3: {
            lorem2: 'ipsum',
            secretNumber2: 123,
            nested4: {
                jon: 'snow'
            }
        }
    },
};

export const App = () => {
    /** @type {[Field[], (fields: Field[]) => void]} */
    const [fields, setFields] = useState(flattenObject(object));
    const json = useMemo(
        () => JSON.stringify(buildObject(fields), null, 4),
        [fields]
    );

    const handleFieldsUpdate = useCallback((updatedFields) => {
        setFields(updatedFields);
    }, [setFields]);

    const handleJsonChange = useCallback((updatedJson, revert) => {
        let object;
        try {
            object = JSON.parse(updatedJson);
        } catch (error) {
            revert();
            return;
        }

        setFields(flattenObject(object));
    }, [setFields]);

    return (
        <div className="app-wrapper">
            <div className="app">
                <FieldList
                    className="app__field-list"
                    fields={fields}
                    onFieldsUpdate={handleFieldsUpdate}
                />

                <TextEditor
                    className="app__json-editor"
                    value={json}
                    onChange={handleJsonChange}
                    debounceDelay={1000}
                />
            </div>
        </div>
    );
};
