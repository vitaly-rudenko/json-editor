import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { flattenObject } from '../model/flattenObject';
import { buildObject } from '../model/buildObject';
import { FieldType } from '../model/FieldType';
import { Field } from '../model/Field';
import { FieldBlock } from './FieldBlock';
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

    const onDragEnd = useCallback((result) => {
        if (!result.destination) {
            return;
        }

        const source = result.source.index;
        const destination = result.destination.index;

        if (source === destination) {
            return;
        }

        const field = fields[source];
        const before = source > destination ? destination - 1 : destination;
        const after = source > destination ? destination : destination + 1;
        const beforeDestination = fields[before];
        const afterDestination = fields[after];

        const destinationSample = afterDestination || beforeDestination;

        const children = [];        
        const chain = [...field.parentChain, field.key];
        if (field.type === FieldType.OBJECT) {
            for (const field of fields) {
                if (field.parentChain.toString().startsWith(chain.toString())) {
                    children.push(field);
                }
            }
        }

        // TODO: same key problem
        // TODO: move object inside itself
        // TODO: move inside empty object

        const updatedField = new Field(field);
        updatedField.parentChain = destinationSample.parentChain;

        const updatedFields = [...fields];
        updatedFields.splice(before + 1, 0, updatedField);
        updatedFields.splice(updatedFields.indexOf(field), 1);

        for (const child of children) {
            updatedFields.splice(updatedFields.indexOf(child), 1);
        }

        const updatedChildren = children.map((child) => {
            const updatedChild = new Field(child);

            updatedChild.parentChain = [
                ...updatedField.parentChain,
                updatedField.key,
                ...child.parentChain.slice(chain.length)
            ];

            return updatedChild;
        });

        updatedFields.splice(updatedFields.indexOf(updatedField) + 1, 0, ...updatedChildren);

        setFields(updatedFields);
    }, [fields]);

    return (
        <div>
            <div>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Droppable droppableId="droppable">
                        {(provided) => (
                            <div
                                {...provided.droppableProps}
                                ref={provided.innerRef}
                                className="node-list">
                                {fields.map((field, index) => (
                                    <Draggable
                                        key={field.id}
                                        draggableId={field.id}
                                        index={index}>
                                        {(provided) => (
                                            <FieldBlock
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                index={index}
                                                field={field}
                                            />
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </DragDropContext>
            </div>

            <div>
                <textarea key={objectRepresentation} readOnly={true} className="representation" value={objectRepresentation}></textarea>
            </div>
        </div>
    );
};
