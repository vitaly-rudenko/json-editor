import { FieldType } from "./FieldType";

export class FieldUtil {
    static recognizeType(value: any) {
        if (Array.isArray(value)) {
            return FieldType.ARRAY;
        }

        if (typeof value === 'object' && value !== null) {
            return FieldType.OBJECT;
        }

        return FieldType.PRIMITIVE;
    }
}