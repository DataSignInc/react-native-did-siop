var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import queryString from 'query-string';
import { SIOPRequestValidationError } from './error';
import validateRegistraion from './siop-schema.d.validator';
export const getIssuedAt = () => Math.floor(Date.now() / 1000);
export const parseSIOPRequestUri = (uri) => queryString.parse(uri);
const resolveUriParameter = (something, something_uri, errorCodeOnInvalidUri = 'invalid_request') => __awaiter(void 0, void 0, void 0, function* () {
    if (!something && !something_uri) {
        console.error(errorCodeOnInvalidUri);
        throw new SIOPRequestValidationError('invalid_request');
    }
    if (something) {
        return something;
    }
    else if (something_uri) {
        try {
            if (something_uri.startsWith('https://')) {
                const result = yield fetch(something_uri);
                const bodyText = yield result.text();
                try {
                    const jsonData = JSON.parse(bodyText);
                    return jsonData;
                }
                catch (error) {
                    // Contents of request_uri is plain JWTs (not wrapped in JSON).
                    return bodyText.trimEnd();
                }
            }
            else {
                throw new SIOPRequestValidationError(errorCodeOnInvalidUri, 'something', something_uri);
            }
        }
        catch (error) {
            console.error(error);
            throw new SIOPRequestValidationError(errorCodeOnInvalidUri, 'something', something_uri);
        }
    }
});
export const getRequestObject = (params) => __awaiter(void 0, void 0, void 0, function* () {
    return resolveUriParameter(params.request, params.request_uri, 'invalid_request_uri');
});
export const getRegistration = (request) => __awaiter(void 0, void 0, void 0, function* () {
    const registrationWithoutType = yield resolveUriParameter(request.registration, request.registration_uri, 'invalid_registration_uri');
    try {
        return validateRegistraion(registrationWithoutType);
    }
    catch (error) {
        console.error(error);
        console.error(JSON.stringify(registrationWithoutType, null, 2));
        throw new SIOPRequestValidationError('invalid_registration_object', error);
    }
});
export const getJwks = (registration) => __awaiter(void 0, void 0, void 0, function* () {
    if (!registration.jwks && !registration.jwks_uri) {
        return null;
    }
    return yield resolveUriParameter(registration.jwks, registration.jwks_uri);
});
