import { Field } from './Field';
import { FieldType } from './FieldType';

export class FieldList {
    fields: Field[];

    constructor(source: FieldList | Field[]) {
        if (source instanceof FieldList) {
            this.fields = [...source.fields];
        } else {
            this.fields = source;
        }
    }

    move(source: number, destination: number) {
        if (source === destination) {
            return this;
        }

        const field = this.fields[source];
        const before = source > destination ? destination - 1 : destination;
        const after = source > destination ? destination : destination + 1;
        const beforeDestination = this.fields[before];
        const afterDestination = this.fields[after];

        const destinationSample = afterDestination || beforeDestination;

        const children = [];
        const chain = [...field.parentChain, field.key];
        if (field.type === FieldType.OBJECT) {
            for (const field of this.fields) {
                if (field.parentChain.toString().startsWith(chain.toString())) {
                    children.push(field);
                }
            }
        }

        const updatedField = new Field(field);
        updatedField.parentChain = destinationSample.parentChain;

        const updatedFields = [...this.fields];
        updatedFields.splice(before + 1, 0, updatedField);
        updatedFields.splice(updatedFields.indexOf(field), 1);

        for (const child of children) {
            updatedFields.splice(updatedFields.indexOf(child), 1);
        }

        const updatedChildren = children.map(child => {
            const updatedChild = new Field(child);

            updatedChild.parentChain = [
                ...updatedField.parentChain,
                updatedField.key,
                ...child.parentChain.slice(chain.length),
            ];

            return updatedChild;
        });

        updatedFields.splice(updatedFields.indexOf(updatedField) + 1, 0, ...updatedChildren);

        return new FieldList(updatedFields);
    }
}
