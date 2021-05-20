import queryString from 'query-string';

import {SIOPRequestValidationError} from './error';
import {ErrorCode, Registration} from './siop-schema';
import validateRegistraion from './siop-schema.d.validator';

export const getIssuedAt = () => Math.floor(Date.now() / 1000);

export const parseSIOPRequestUri = (uri: string) => queryString.parse(uri);

const resolveUriParameter = async (
  something?: any,
  something_uri?: string,
  errorCodeOnInvalidUri: ErrorCode = 'invalid_request',
) => {
  if (!something && !something_uri) {
    console.error(errorCodeOnInvalidUri);
    throw new SIOPRequestValidationError('invalid_request');
  }
  if (something) {
    return something;
  } else if (something_uri) {
    try {
      if (something_uri.startsWith('https://')) {
        const result = await fetch(something_uri);
        const bodyText = await result.text();
        try {
          const jsonData = JSON.parse(bodyText);
          return jsonData;
        } catch (error) {
          // Contents of request_uri is plain JWTs (not wrapped in JSON).
          return bodyText.trimEnd();
        }
      } else {
        throw new SIOPRequestValidationError(
          errorCodeOnInvalidUri,
          'something',
          something_uri,
        );
      }
    } catch (error) {
      console.error(error);
      throw new SIOPRequestValidationError(
        errorCodeOnInvalidUri,
        'something',
        something_uri,
      );
    }
  }
};

export const getRequestObject = async (params: any) => {
  return resolveUriParameter(
    params.request,
    params.request_uri,
    'invalid_request_uri',
  );
};

export const getRegistration = async (request: any) => {
  const registrationWithoutType: any = await resolveUriParameter(
    request.registration,
    request.registration_uri,
    'invalid_registration_uri',
  );
  try {
    return validateRegistraion(registrationWithoutType);
  } catch (error) {
    console.error(error);
    console.error(JSON.stringify(registrationWithoutType, null, 2));
    throw new SIOPRequestValidationError('invalid_registration_object', error);
  }
};

export const getJwks = async (registration: Registration) => {
  if (!registration.jwks && !registration.jwks_uri) {
    return null;
  }
  return await resolveUriParameter(registration.jwks, registration.jwks_uri);
};
