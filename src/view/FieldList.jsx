import React, { useCallback } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { FieldBlock } from './FieldBlock';
import './FieldList.css';

export const FieldList = ({ fieldList, onFieldListUpdate, className = '' }) => {
    const onDragEnd = useCallback((result) => {
        if (!result.destination) {
            return;
        }

        const source = result.source.index;
        const destination = result.destination.index;

        const updatedFieldList = fieldList.move(source, destination);
        
        if (updatedFieldList !== fieldList) {
            onFieldListUpdate(updatedFieldList);
        }
    }, [fieldList, onFieldListUpdate]);

    return (
        <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="droppable">
                {(provided) => (
                    <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className={`field-list ${className}`}>
                        {fieldList.fields.map((field, index) => (
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
