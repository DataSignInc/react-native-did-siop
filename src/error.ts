import {ErrorCode} from './siop-schema';

export class SIOPError extends Error {
  private error: ErrorCode;
  constructor(error: ErrorCode) {
    super(error);
    this.error = error;
  }
}

export class SIOPRequestValidationError extends SIOPError {}

export class SIOPResponseGenerationError extends SIOPError {}
