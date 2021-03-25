import {ErrorCode} from './siop-schema';

export class SIOPError extends Error {
  private error: ErrorCode;
  constructor(error: ErrorCode) {
    super(error);
    this.error = error;
  }
}

export class SIOPRequestValidationError extends SIOPError {
  public invalidField?: string;
  public invalidValue?: any;

  constructor(error: ErrorCode, invalidField?: string, invalidValue?: any) {
    super(error);
    this.invalidField = invalidField;
    this.invalidValue = invalidValue;
  }
}

export class SIOPResponseGenerationError extends SIOPError {}
