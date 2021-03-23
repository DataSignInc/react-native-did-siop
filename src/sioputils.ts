import didJWT, {JWTHeader} from 'did-jwt';
import queryString from 'query-string';
import {getResolver} from './did/resolver';
import {SIOPRequestValidationError} from './error';
import {verifyJWT} from './jwt';
import {debug} from './log';
import {ErrorCode, Registration, Request, RequestObject} from './siop-schema';
import validateRegistraion from './siop-schema.d.validator';
export class SIOPValidator {
  async validateSIOPRequest(request: any) {
    const jwt: string = request.request;
    let decoded;
    try {
      await verifyJWT(jwt);
      decoded = didJWT.decodeJWT(jwt);
      debug('============ RequestObject ===============', decoded);
      // const key = new Key(decoded.header);
    } catch (error) {
      console.error('JWT verification failed');
      throw error;
    }

    // validate paramters
    const requestObject = decoded.payload;
    this.validateOIDCParameters(request, requestObject);
    const registration = await getRegistration(request);
    this.validateDIDAuthnParameters(
      requestObject,
      registration,
      decoded.header,
    );

    return {
      request: request as Request,
      requestObject: requestObject as RequestObject,
    };
  }

  validateDIDAuthnParameters(
    request: RequestObject,
    registration: Registration,
    jwtHeader: JWTHeader,
  ) {
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
      return; // DID Authn verification is not needed.
    }

    const resolver = getResolver();
    const document = resolver.resolve(request.iss);

    if (registration.jwks_uri) {
      if (registration.jwks_uri !== request.iss) {
        throw new SIOPRequestValidationError('invalid_request_object');
      }
    }

    // TODO: get verification method from document corresponding with `kid`

    if (request.kid === jwtHeader.kid) {
      // verification success
      // because did authn is already done at previous JWS signature verification.
      return;
    }

    // TODO: JWS signature verification with the key of request.kid
  }

  async validateOIDCParameters(params: Request, requestObject: any) {
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
        throw new SIOPRequestValidationError('invalid_request');
      } else {
        // TODO: implement registration only flow.
        throw new SIOPRequestValidationError('registration_not_supported');
      }
    }
    if (!containsAllRequiredParameters) {
      throw new SIOPRequestValidationError('invalid_request');
    }

    this.validateScope(params.scope);
    this.validateResponseType(params.response_type);

    const request = await getRequestObject(params);
    const registration = await getRegistration(request);

    this.validateClientId(params, request, registration);

    this.validateIss(request.iss, registration);
    this.validateKid(request.kid, registration);
  }

  validateClientId(
    request: Request,
    requestObject: RequestObject,
    registration?: Registration,
  ) {
    if (!request.client_id || !requestObject.client_id) {
      throw new SIOPRequestValidationError('invalid_request_object');
    }
    if (request.client_id !== requestObject.client_id) {
      throw new SIOPRequestValidationError('invalid_request_object');
    }
    const client_id = requestObject.client_id;
    if (registration && registration.redirect_uris) {
      if (registration.redirect_uris.includes(client_id)) {
        return; // valid!
      } else {
        throw new SIOPRequestValidationError('invalid_request_object');
      }
    }
  }

  validateResponseType(response_type: string) {
    if (!response_type) {
      throw new SIOPRequestValidationError('invalid_request');
    }
    if (response_type !== 'id_token') {
      throw new SIOPRequestValidationError('unsupported_response_type');
    }
  }

  validateIss(iss?: string, registration?: Registration) {
    if (!iss) {
      throw new SIOPRequestValidationError('invalid_request_object');
    }
    if (registration && registration.did) {
      if (iss !== registration.did) {
        throw new SIOPRequestValidationError('invalid_request_object');
      } else {
        return; // valid!
      }
    }
  }

  validateScope(scope?: string) {
    if (!scope) {
      throw new SIOPRequestValidationError('invalid_scope');
    }
    const scopeArray = scope.split(' ');
    const isScopeValid =
      scopeArray.includes('openid') && scopeArray.includes('did_authn');
    if (!isScopeValid) {
      throw new SIOPRequestValidationError('invalid_scope');
    }
  }

  validateKid(kid?: string, registraion?: Registration) {
    // TODO: implement after JWKS is implemented
    return kid && true;
  }
}

const resolveUriParameter = async (
  something?: any,
  something_uri?: string,
  errorCodeOnInvalidUri: ErrorCode = 'invalid_request',
) => {
  if (!something && !something_uri) {
    throw new SIOPRequestValidationError('invalid_request');
  }
  if (something) {
    return something;
  } else if (something_uri) {
    try {
      if (something_uri.startsWith('https://')) {
        const result = await fetch(something_uri);
        const jsonData = await result.json();
        return jsonData;
      }
    } catch (error) {
      throw new SIOPRequestValidationError(errorCodeOnInvalidUri);
    }
  }
};

const getRequestObject = async (params: any) => {
  return await resolveUriParameter(
    params.request,
    params.request_uri,
    'invalid_request_uri',
  );
};

const getRegistration = async (request: any) => {
  const registrationWithoutType: any = await resolveUriParameter(
    request.registration,
    request.registration_uri,
    'invalid_registration_uri',
  );
  try {
    return validateRegistraion(registrationWithoutType);
  } catch (error) {
    throw new SIOPRequestValidationError('invalid_registration_object');
  }
};

export class URLParser {
  // openid://?response_type=id_token
  // &client_id=https%3A%2F%2Frp.example.com%2Fcb
  // &scope=openid%20did_authn
  // &request=<JWT>
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  // async parse() {
  //   this.validateScheme();
  //   const params = this.getParameters();
  //   const jwt = params.request;
  //   try {
  //     const verifiedJWT = await verifyJWT(jwt);
  //     const decoded = didJWT.decodeJWT(jwt);
  //     return {params: params, request: decoded};
  //   } catch (error) {
  //     console.error(error);
  //     throw error;
  //   }
  // }

  validateScheme() {
    return this.url.startsWith('openid://');
  }

  getParameters() {
    const {url, query} = queryString.parseUrl(this.url);
    // scope, response_type and client_id are only for backward compatibility.

    return query;
  }

  validateParameters(params: any) {}
}
