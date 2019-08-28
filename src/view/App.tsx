import React, { useState, useCallback, useMemo } from 'react';
import { ObjectBuilderLegacy as ObjectBuilder } from '../model/ObjectBuilderLegacy';
import { FieldListBuilderLegacy as FieldListBuilder } from '../model/FieldListBuilderLegacy';
import { FieldListContainer } from './FieldListContainer';
import { TextEditor } from './TextEditor';
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
    const [fieldList, setFieldList] = useState(
        FieldListBuilder.from(object)
    );

    const json = useMemo(
        () => JSON.stringify(
            ObjectBuilder.fromFieldList(fieldList),
            null,
            4
        ),
        [fieldList]
    );

    const handleFieldListUpdate = useCallback(() => {
        setFieldList(fieldList.clone());
    }, [fieldList, setFieldList]);

    const handleJsonChange = useCallback((updatedJson, revert) => {
        let object;
        try {
            object = JSON.parse(updatedJson);
        } catch (error) {
            revert();
            return;
        }

        setFieldList(
            FieldListBuilder.from(object)
        );
    }, [setFieldList]);

    return (
        <div className="app-wrapper">
            <div className="app">
                <FieldListContainer
                    className="app__field-list"
                    fieldList={fieldList}
                    onFieldListUpdate={handleFieldListUpdate}
                />

                <TextEditor
                    className="app__json-editor"
                    value={json}
                    onChange={handleJsonChange}
                />
            </div>
        </div>
    );
};
