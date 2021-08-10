export class SIOPError extends Error {
    constructor(error) {
        super(error);
        this.error = error;
    }
    toResponse() {
        return { error: this.error };
    }
}
export class SIOPRequestValidationError extends SIOPError {
    constructor(error, invalidField, invalidValue) {
        super(error);
        this.invalidField = invalidField;
        this.invalidValue = invalidValue;
    }
}
export class SIOPResponseGenerationError extends SIOPError {
}
