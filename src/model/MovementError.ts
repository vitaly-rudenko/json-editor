export class MovementError extends Error {
    readonly code: string;

    constructor({ code, message }: { code: string, message?: string }) {
        super(`[${code}] ${message || 'Unexpected error'}`);

        this.code = code;

        Error.captureStackTrace(this, MovementError);
        Object.setPrototypeOf(this, MovementError.prototype);
    }
}
