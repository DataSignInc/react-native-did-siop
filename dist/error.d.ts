import { ErrorCode } from './siop-schema';
export declare class SIOPError extends Error {
    private error;
    constructor(error: ErrorCode);
    toResponse(): {
        error: ErrorCode;
    };
}
export declare class SIOPRequestValidationError extends SIOPError {
    invalidField?: string;
    invalidValue?: any;
    constructor(error: ErrorCode, invalidField?: string, invalidValue?: any);
}
export declare class SIOPResponseGenerationError extends SIOPError {
}
