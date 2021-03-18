import didJWT from 'did-jwt';
import queryString from 'query-string';
import {verifyJWT} from './jwt';
import {debug} from './log';
import {Registration, Request, RequestObject, ErrorCode} from './siop-schema';

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
    this.validateDIDAuthnParameters(request);

    return {
      request: request as Request,
      requestObject: requestObject as RequestObject,
    };
  }

  validateDIDAuthnParameters(params: Request) {
    // test if scope contains `did_authn`
    // resolve did doc from `iss`
    // if jwks_uri is present: test if `jwks_uri` == `iss`
    // determine the verification method from that document
    // verify siop request according to the verification method above
  }

  validateOIDCParameters(params: Request, requestObject: any) {
    /*
      OAuth 2.0 validation - https://tools.ietf.org/html/rfc6749#section-4.1.1
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

    this.validateOAuth2Parameters(params);

    // OIDC validation
    const containsAllRequiredParameters =
      params.scope &&
      params.response_type &&
      params.client_id &&
      params.client_id === requestObject.client_id &&
      requestObject.iss &&
      requestObject.kid;

    const containsRequest = params.request || params.request_uri;
    const containsRegistration =
      (containsRequest &&
        (requestObject.registration || requestObject.registration_uri)) ||
      (!containsRequest && (params.registration || params.registration_uri));

    if (!(containsAllRequiredParameters && containsRegistration)) {
      throw 'invalid_request' as ErrorCode;
    }

    this.validateScope(params.scope);

    if (params.response_type !== 'id_token') {
      throw 'unsupported_response_type' as ErrorCode;
    }

    const registration = getRegistration(params);

    this.validateIss(requestObject.iss, registration);
    this.validateKid(requestObject.kid, registration);
  }

  validateIss(iss?: string, registration?: Registration) {
    if (!iss) {
      throw 'invalid_request_object' as ErrorCode;
    }
    if (registration && registration.did) {
      if (iss !== registration.did) {
        throw 'invalid_request_object' as ErrorCode;
      } else {
        return; // valid!
      }
    }
  }

  validateScope(scope: string) {
    const scopeArray = scope.split(' ');
    const isScopeValid =
      scopeArray.includes('openid') && scopeArray.includes('did_authn');
    if (!isScopeValid) {
      throw 'invalid_scope' as ErrorCode;
    }
  }

  validateKid(kid?: string, registraion?: Registration) {
    // TODO: implement after JWKS is implemented
    return kid && true;
  }

  validateOAuth2Parameters(params: Request) {
    /*
      OAuth 2.0 validation - https://tools.ietf.org/html/rfc6749#section-4.1.1
        test if all the required parameters are present and valid
          required parameters are response_type and client_id
        test if `redirect_uri` matches to the registered one
       */
    const validResponseType =
      params.response_type && params.response_type == 'token';
    // https://tools.ietf.org/html/rfc6749#section-2.2
    const valid_client_id = params.client_id;
    // https://tools.ietf.org/html/rfc6749#section-3.1.2
    // const valid_redirect_uri = params.redirect_uri;
  }
}

const getRegistration = (params: any) => {
  if (params.registration) {
    return params.registration;
  } else if (params.registration_uri) {
    return {};
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
