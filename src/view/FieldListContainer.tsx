import React, { useCallback, FunctionComponent } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';
import { FieldList } from '../model/FieldList';
import { FieldBlock } from './FieldBlock';
import './FieldListContainer.css';
import { MovementError } from '../model/MovementError';

export const FieldListContainer: FunctionComponent<{
    fieldList: FieldList,
    onFieldListUpdate: () => void,
    className?: string,
}> = ({
    fieldList,
    onFieldListUpdate,
    className = ''
}) => {
    const onDragEnd = useCallback((result: DropResult) => {
        if (
            !result.destination ||
            result.source.index === result.destination.index
        ) return;

        const source = result.source.index;
        const destination = result.destination.index;

        let precendingIndex: number | null;
        let followingIndex: number | null;

        if (source > destination) {
            precendingIndex = destination === 0 ? null : destination - 1;
            followingIndex = destination;
        } else {
            precendingIndex = destination;
            followingIndex = destination === fieldList.fields.length - 1 ? null : destination + 1;
        }

        try {
            if (fieldList.moveField(source, [precendingIndex, followingIndex])) {
                onFieldListUpdate();
            }
        } catch (error) {
            if (error instanceof MovementError) {
                console.warn(error.message);
            } else {
                throw error;
            }
        }
    }, [onFieldListUpdate, fieldList]);

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
