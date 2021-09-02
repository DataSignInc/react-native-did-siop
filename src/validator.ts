import {JWTHeader, decodeJWT} from 'did-jwt';
import {Resolver} from 'did-resolver';
import {SIOPRequestValidationError} from './error';
import {verifyJWT} from './jwt';
import {debug} from './log';
import {Registration, Request, RequestObject} from './siop-schema';
import {getRegistration, getJwks, getRequestObject} from './sioputils';
export default class SIOPValidator {
  private resolver: Resolver;
  private clientId?: string;
  private state?: string;

  constructor(resolver: Resolver, clientId?: string, state?: string) {
    this.resolver = resolver;
    this.clientId = clientId;
    this.state = state;
  }
  async validateSIOPRequest(request: any) {
    // validate paramters
    // const requestObject = decoded.payload;
    await this.validateOIDCQueryParameters(request);
    const requestObjectJWT = await getRequestObject(request);
    const decoded = await this.validateSignature(requestObjectJWT);
    const requestObject = decoded.payload;

    const registration = await getRegistration(requestObject);
    await this.validateRequestObject(requestObject, request, registration);
    this.validateDIDAuthnParameters(
      requestObject as RequestObject,
      registration,
      decoded.header,
    );

    return {
      request: request as Request,
      requestObject: requestObject as RequestObject,
    };
  }

  async validateSignature(jwt: string) {
    try {
      await verifyJWT(jwt, this.resolver);
      return decodeJWT(jwt);
    } catch (error) {
      console.error('JWT verification failed');
      console.error(error);
      throw new SIOPRequestValidationError(
        'invalid_request',
        this.clientId,
        this.state,
        'jwt signature',
      );
    }
  }

  validateDIDAuthnParameters(
    request: RequestObject,
    registration: Registration,
    jwtHeader: JWTHeader,
  ) {
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
      throw new SIOPRequestValidationError(
        'invalid_scope',
        this.clientId,
        this.state,
        'scope',
        request.scope,
      );
    }

    // const resolver = getResolver();
    // const document = resolver.resolve(request.iss);

    // if (registration.jwks_uri) {
    //   if (jwskContains(registration.jwks, request.iss)) {
    //     // if (registration.jwks_uri !== request.iss) {
    //     throw new SIOPRequestValidationError('invalid_request_object', this.clientId, this.state);
    //   }
    // }

    // TODO: get verification method from document corresponding with `kid`
    if (request.kid === jwtHeader.kid) {
      // verification success
      // because did authn is already done at previous JWS signature verification.
      return;
    } else {
      // TODO: JWS signature verification with the key of request.kid
      console.error(
        'request.kid ===',
        request.kid,
        'jwtHeader.kid ===',
        jwtHeader.kid,
      );
      throw new SIOPRequestValidationError(
        'invalid_request',
        this.clientId,
        this.state,
        'kid',
        request.kid,
      );
    }
  }

  async validateOIDCQueryParameters(params: any) {
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
    const containsAllRequiredParameters =
      params.scope && params.response_type && params.client_id;

    const containsRequest = params.request || params.request_uri;
    if (!containsRequest) {
      // this SIOP request asks me not to authentication but to just register RP meta data.
      // In this case params MUST contain registration or registration_uri params.
      if (!params.registration && !params.registration_uri) {
        throw new SIOPRequestValidationError(
          'invalid_request',
          this.clientId,
          this.state,
          'registration',
        );
      } else {
        // TODO: implement registration only flow.
        throw new SIOPRequestValidationError(
          'registration_not_supported',
          this.clientId,
          this.state,
        );
      }
    }
    if (!containsAllRequiredParameters) {
      throw new SIOPRequestValidationError(
        'invalid_request',
        this.clientId,
        this.state,
        'requiredFields',
      );
    }

    this.validateScope(params.scope);
    this.validateResponseType(params.response_type);
  }

  async validateRequestObject(
    requestObject: any,
    params: any,
    registration: Registration,
  ) {
    const jwks = await getJwks(registration);

    this.validateClientId(params, requestObject, registration);
    this.validateIss(requestObject.iss, registration);
    this.validateKid(requestObject.kid, registration, jwks);
  }

  validateClientId(
    request: Request,
    requestObject: RequestObject,
    registration?: Registration,
  ) {
    if (!request.client_id || !requestObject.client_id) {
      throw new SIOPRequestValidationError(
        'invalid_request_object',
        undefined,
        undefined,
        'client_id',
        null,
      );
    }
    if (request.client_id !== requestObject.client_id) {
      throw new SIOPRequestValidationError(
        'invalid_request_object',
        undefined,
        undefined,
        'client_id',
        requestObject.client_id,
      );
    }
    const client_id = requestObject.client_id;
    if (registration && registration.redirect_uris) {
      if (registration.redirect_uris.includes(client_id)) {
        return; // valid!
      } else {
        throw new SIOPRequestValidationError(
          'invalid_request_object',
          undefined,
          undefined,
          'client_id',
          client_id,
        );
      }
    }
  }

  validateResponseType(response_type: string) {
    if (!response_type) {
      throw new SIOPRequestValidationError(
        'invalid_request',
        this.clientId,
        this.state,
        'response_type',
        response_type,
      );
    }
    if (response_type !== 'id_token') {
      throw new SIOPRequestValidationError(
        'unsupported_response_type',
        this.clientId,
        this.state,
        'response_type',
        response_type,
      );
    }
  }

  validateIss(iss?: string, registration?: Registration) {
    if (!iss) {
      throw new SIOPRequestValidationError(
        'invalid_request_object',
        this.clientId,
        this.state,
        'iss',
        null,
      );
    }
    if (registration && registration.did) {
      if (iss !== registration.did) {
        throw new SIOPRequestValidationError(
          'invalid_request_object',
          this.clientId,
          this.state,
          'iss',
          iss,
        );
      } else {
        return; // valid
      }
    }
  }

  validateScope(scope?: string) {
    if (!scope) {
      throw new SIOPRequestValidationError(
        'invalid_scope',
        this.clientId,
        this.state,
        'scope',
        scope,
      );
    }
    const scopeArray = scope.split(' ');
    const isScopeValid =
      scopeArray.includes('openid') && scopeArray.includes('did_authn');
    if (!isScopeValid) {
      throw new SIOPRequestValidationError(
        'invalid_scope',
        this.clientId,
        this.state,
        'scope',
        scope,
      );
    }
  }

  validateKid(kid?: string, registraion?: Registration, jwks?: any) {
    // Equality check between kid and JWTHeader.kid (and subsequent verification steps) are done at did authn verification phase.
    // TODO understanding JWSK data structure
    // if (jwks && !jwks.includes(kid)) {
    //   throw new SIOPRequestValidationError('invalid_request_object', this.clientId, this.state);
    // } else {
    //   return;
    // }
  }
}
