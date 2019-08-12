import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { flattenObject } from '../model/flattenObject';
import { buildObject } from '../model/buildObject';
import { FieldList } from './FieldList';
import './App.css';

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
    const objectRepresentation = useMemo(
        () => JSON.stringify(buildObject(fields), null, 4),
        [fields]
    );

    useEffect(() => {
        console.log(JSON.stringify(buildObject(fields), null, 4));
    }, [fields]);

    const handleFieldsUpdate = useCallback((updatedFields) => {
        setFields(updatedFields);
    }, [setFields]);

    return (
        <div>
            <FieldList fields={fields} onFieldsUpdate={handleFieldsUpdate} />

            <div>
                <textarea key={objectRepresentation} readOnly={true} className="representation" value={objectRepresentation}></textarea>
            </div>
        </div>
    );
};
