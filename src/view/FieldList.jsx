import React, { useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FieldType } from '../model/FieldType';
import { Field } from '../model/Field';
import { FieldBlock } from './FieldBlock';
import './FieldList.css';

export const FieldList = ({ fields, onFieldsUpdate, className = '' }) => {
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
        // TODO: array support

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

        onFieldsUpdate(updatedFields);
    }, [fields, onFieldsUpdate]);

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
                {(provided) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`field-list ${className}`}>
                        {fields.map((field, index) => (
                            <Draggable
                                key={field.id}
                                draggableId={field.id}
                                index={index}>
                                {(provided) => (
                                    <FieldBlock
                                        className="field-list__field-block"
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
    )
};
