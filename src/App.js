import React, { useState, useCallback, useEffect, useMemo } from 'react';
import shortid from 'shortid';
import './styles.css';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

const Type = {
    PRIMITIVE: 'primitive',
    OBJECT: 'object',
};

const isObject = (value) => {
    return typeof value === 'object' && value !== null;
};

class Field {
    /** @type {string} */ id;
    /** @type {string} */ type;
    /** @type {string[]} */ parentChain;
    /** @type {string} */ key;
    /** @type {any} */ value;

    constructor(source) {
        this.id = source.id || shortid();
        this.type = source.type || (isObject(source.value) ? Type.OBJECT : Type.PRIMITIVE);
        this.parentChain = source.parentChain;
        this.key = source.key;
        this.value = isObject(source.value) ? undefined : source.value;
    }

    get level() {
        return this.parentChain.length;
    }
}

const flatten = (object, parentChain = []) => {
    const fields = [];

    for (const [key, value] of Object.entries(object)) {
        fields.push(
            new Field({
                key, value, parentChain,
            })
        );

        if (isObject(value)) {
            fields.push(
                ...flatten(value, [...parentChain, key])
            );
        }
    }

    return fields;
};

/** @param {Field[]} fields */
const buildObject = (fields) => {
    const result = {};

    for (const field of fields) {
        let parent = result;

        for (const parentKey of field.parentChain) {
            if (parent[parentKey] === undefined) {
                parent[parentKey] = {};
            }

            parent = parent[parentKey];
        }

        parent[field.key] = field.value === undefined ? {} : field.value;
    }

    return result;
};

const levelColors = [0xcfe2f1, 0xfeffa0, 0xf3d1d4, 0xcfffd0];

const stringify = (value) => {
    if (typeof value === 'string') {
        return '"' + value + '"';
    }

    if (value === undefined) {
        return '{}';
    }

    return String(value);
};

const Node = React.forwardRef(
    /** @param {{ field: Field }} props */
    ({ field, index = 0, onDrag, ...props }, ref) => {
        return (
            <div
                ref={ref}
                {...props}
                className="node"
                style={{
                    ...props.style || {},
                    marginLeft: `${field.level * 16}px`,
                    backgroundColor:
                        '#' + levelColors[field.level % levelColors.length].toString(16)
                }}
            >
                {field.key}: {stringify(field.value)}
            </div>
        );
    }
);

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
    const [fields, setFields] = useState(flatten(object));
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
        if (field.type === Type.OBJECT) {
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
                                            <Node
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
