var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { decodeJWT } from 'did-jwt';
import { SIOPRequestValidationError } from './error';
import { verifyJWT } from './jwt';
import { getRegistration, getJwks, getRequestObject } from './sioputils';
export default class SIOPValidator {
    constructor(resolver) {
        this.resolver = resolver;
    }
    validateSIOPRequest(request) {
        return __awaiter(this, void 0, void 0, function* () {
            // validate paramters
            // const requestObject = decoded.payload;
            yield this.validateOIDCQueryParameters(request);
            const requestObjectJWT = yield getRequestObject(request);
            const decoded = yield this.validateSignature(requestObjectJWT);
            const requestObject = decoded.payload;
            const registration = yield getRegistration(requestObject);
            yield this.validateRequestObject(requestObject, request, registration);
            this.validateDIDAuthnParameters(requestObject, registration, decoded.header);
            return {
                request: request,
                requestObject: requestObject,
            };
        });
    }
    validateSignature(jwt) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield verifyJWT(jwt, this.resolver);
                return decodeJWT(jwt);
            }
            catch (error) {
                console.error('JWT verification failed');
                console.error(error);
                throw new SIOPRequestValidationError('invalid_request', 'jwt signature');
            }
        });
    }
    validateDIDAuthnParameters(request, registration, jwtHeader) {
        // TODO: implement all vefirication logic
        // TOOD: Reorder the verification steps for efficiency.
        // The order described in the v0.1 spec is inefficient.
        // (why it places resolution of did documents before checking `iss` and `kid`?)
        // test if scope contains `did_authn`
        // resolve did doc from `iss`
        // if jwks_uri is present: test if `jwks_uri` == `iss`
        // determine the verification method from that document (with kid in SIOP request)
        //
        // verify siop request according to the verification method above
        if (!request.scope.includes('did_authn')) {
            throw new SIOPRequestValidationError('invalid_scope', 'scope', request.scope);
        }
        // const resolver = getResolver();
        // const document = resolver.resolve(request.iss);
        // if (registration.jwks_uri) {
        //   if (jwskContains(registration.jwks, request.iss)) {
        //     // if (registration.jwks_uri !== request.iss) {
        //     throw new SIOPRequestValidationError('invalid_request_object');
        //   }
        // }
        // TODO: get verification method from document corresponding with `kid`
        if (request.kid === jwtHeader.kid) {
            // verification success
            // because did authn is already done at previous JWS signature verification.
            return;
        }
        else {
            // TODO: JWS signature verification with the key of request.kid
            console.error('request.kid ===', request.kid, 'jwtHeader.kid ===', jwtHeader.kid);
            throw new SIOPRequestValidationError('invalid_request', 'kid', request.kid);
        }
    }
    validateOIDCQueryParameters(params) {
        return __awaiter(this, void 0, void 0, function* () {
            /*
              Procedure:
        
        
              OAuth 2.0 validation (omitted to avoid duplicated steps) - https://tools.ietf.org/html/rfc6749#section-4.1.1
                test if all the required parameters are present and valid
                test if `redirect_uri` matches to the registered one
              test if scope contains 'openid'
              test if all the REQUIRED parameters are present and valid
                required paramters are:
                  scope
                  respnose_type === id_token
                  client_id MUST be the redirect URI of the RP
                  request or request_uri
        
                  iss == RP's DID
                  kid == DID URL (e.g., `did:example:0xab#key1`)
                  scope MUST include `did_authn`
                  registration or registration_uri MUST be included
              if `sub` claim is in `claims` parameters: assert not different users' subject identifiers.
        
              unrecognized request paramters SHOULD be ignored as per the OAuth 2.0 spec
        
              test if scope contains `did_authn`
              */
            // OIDC validation
            const containsAllRequiredParameters = params.scope && params.response_type && params.client_id;
            const containsRequest = params.request || params.request_uri;
            if (!containsRequest) {
                // this SIOP request asks me not to authentication but to just register RP meta data.
                // In this case params MUST contain registration or registration_uri params.
                if (!params.registration && !params.registration_uri) {
                    throw new SIOPRequestValidationError('invalid_request', 'registration');
                }
                else {
                    // TODO: implement registration only flow.
                    throw new SIOPRequestValidationError('registration_not_supported');
                }
            }
            if (!containsAllRequiredParameters) {
                throw new SIOPRequestValidationError('invalid_request', 'requiredFields');
            }
            this.validateScope(params.scope);
            this.validateResponseType(params.response_type);
        });
    }
    validateRequestObject(requestObject, params, registration) {
        return __awaiter(this, void 0, void 0, function* () {
            const jwks = yield getJwks(registration);
            this.validateClientId(params, requestObject, registration);
            this.validateIss(requestObject.iss, registration);
            this.validateKid(requestObject.kid, registration, jwks);
        });
    }
    validateClientId(request, requestObject, registration) {
        if (!request.client_id || !requestObject.client_id) {
            throw new SIOPRequestValidationError('invalid_request_object', 'client_id', null);
        }
        if (request.client_id !== requestObject.client_id) {
            throw new SIOPRequestValidationError('invalid_request_object', 'client_id', requestObject.client_id);
        }
        const client_id = requestObject.client_id;
        if (registration && registration.redirect_uris) {
            if (registration.redirect_uris.includes(client_id)) {
                return; // valid!
            }
            else {
                throw new SIOPRequestValidationError('invalid_request_object', 'client_id', client_id);
            }
        }
    }
    validateResponseType(response_type) {
        if (!response_type) {
            throw new SIOPRequestValidationError('invalid_request', 'response_type', response_type);
        }
        if (response_type !== 'id_token') {
            throw new SIOPRequestValidationError('unsupported_response_type', undefined, response_type);
        }
    }
    validateIss(iss, registration) {
        if (!iss) {
            throw new SIOPRequestValidationError('invalid_request_object', 'iss', null);
        }
        if (registration && registration.did) {
            if (iss !== registration.did) {
                throw new SIOPRequestValidationError('invalid_request_object', 'iss', iss);
            }
            else {
                return; // valid
            }
        }
    }
    validateScope(scope) {
        if (!scope) {
            throw new SIOPRequestValidationError('invalid_scope', 'scope', scope);
        }
        const scopeArray = scope.split(' ');
        const isScopeValid = scopeArray.includes('openid') && scopeArray.includes('did_authn');
        if (!isScopeValid) {
            throw new SIOPRequestValidationError('invalid_scope', 'scope', scope);
        }
    }
    validateKid(kid, registraion, jwks) {
        // Equality check between kid and JWTHeader.kid (and subsequent verification steps) are done at did authn verification phase.
        // TODO understanding JWSK data structure
        // if (jwks && !jwks.includes(kid)) {
        //   throw new SIOPRequestValidationError('invalid_request_object');
        // } else {
        //   return;
        // }
    }
}
