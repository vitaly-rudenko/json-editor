import React, { useState, useCallback, useMemo } from 'react';
import { FieldList } from './FieldList';
import { TextEditor } from './TextEditor';
import './App.css';
import { ObjectBuilder } from '../model/ObjectBuilder';
import { FieldListBuilder } from '../model/FieldListBuilder';

// const object = {
//     hello: 'world',
//     isEnabled: true,
//     nested: {
//         lorem: 'ipsum',
//         secretNumber: 123,
//         nested2: {
//             jon: 'snow'
//         },
//         array: [1,2,[3,4,5,[6,7]],8,9,{
//             hello: 'world',
//             array2: [{
//                 isEnabled3: true,
//                 nested5: {
//                     lorem3: 'ipsum',
//                     secretNumber3: 123,
//                     nested6: {
//                         jon: 'snow'
//                     }
//                 }
//             }]
//         }]
//     },
//     inception: {
//         hello2: 'world',
//         isEnabled2: true,
//         nested3: {
//             lorem2: 'ipsum',
//             secretNumber2: 123,
//             nested4: {
//                 jon: 'snow'
//             }
//         }
//     },
// };

const object = {
    a: {
        b: true,
        c: {
            hello: 'world'
        },
        d: 'hey there',
        e: 123
    },
    f: {
        g: [1,2,3,4,5],
        a: 'jon snow',
    }
};

export const App = () => {
    /** @type {[FieldList, (value: FieldList) => void]} */
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

    const handleFieldListUpdate = useCallback((updatedFieldList) => {
        setFieldList(updatedFieldList);
    }, [setFieldList]);

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
                <FieldList
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
