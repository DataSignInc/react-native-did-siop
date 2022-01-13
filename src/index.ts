import Provider from './siop';

export default Provider;

import {
  RequestObject,
  Registration,
  SigningAlgorithm,
  DIDMethodPrefix,
  ErrorCode,
} from './siop-schema';
export type {
  RequestObject,
  Registration,
  SigningAlgorithm,
  DIDMethodPrefix,
  ErrorCode,
};

export {
  SIOPError,
  SIOPRequestValidationError,
  SIOPResponseGenerationError,
} from './error';
