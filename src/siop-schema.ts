export type DIDMethodPrefix = string;
export type SigningAlgorithm = 'RS256' | 'ES256' | 'ES256K' | 'EdDSA';

export interface Registration {
  // 2.2.1. Passing Relying Party Registration Metadata by Value
  // 2.2.3. Relying Party Registration Metadata Values
  // This part seems WIP.
  // https://bitbucket.org/openid/connect/src/2b3f0c276b7ea9917d37dc58c935e382693c15f7/openid-connect-self-issued-v2-1_0.md

  // TODO: 2.2.4. Relying Party Registration Metadata Error Response
  authorization_endpoint: 'openid:';
  issuer: 'https://self-issued.me/v2';
  response_types_supported: ['id_token'];

  scopes_supported: ('openid' | 'profile' | 'email' | 'address' | 'phone')[];
  subject_types_supported: ('pairwise' | 'public')[];
  // jkt: JWK Thumbprint Subject sub type. [RFC7638]
  // DIDMethodPrefix: did Decentralized sub type.
  subject_identifier_types_supported: ('jkt' | DIDMethodPrefix)[];
  // RP can indicate that it doesn't support a did method included
  // in the subject_identiier_types_supported field by omitting it from
  // did_methods_supported.
  did_methods_supported?: DIDMethodPrefix[];
  credential_formats_supported: (
    | 'jwt'
    | 'jwt_vc'
    | 'jwt_vp'
    | 'ldp_vc'
    | 'ldp_vp'
  )[];
  id_token_signing_alg_values_supported: SigningAlgorithm[];
  request_object_signing_alg_values_supported: ('none' | SigningAlgorithm)[];
  policy_uri?: string;
  tos_uri?: string;
  logo_uri?: string;
  // if RP uses more than one redirection URIs
  redirect_uris?: string[];

  // The 3 params below are typically used if the RP is requesting encrypted responses.
  // JSON Web Key Set (JWKS)
  // The spec v0.1 says jwks_uri is REQUIRED. The v2 spec doesn't mention its criticality.
  // jwks_uri MUST use the HTTP(S) DID Resolution Binding as per [DID.Resolution] for backward compatibility reasons with plain SIOP OPs (v0.1).
  jwks_uri?: string;
  jwks?: any; // The jwks request parameter SHOULD be used only if the public key cannot be directly obtained from the DID Document.
  id_token_encrypted_response_alg?: string;
  id_token_encrypted_response_enc?: string;

  // Registration parameter may include decentralized identifier of the RP.
  did?: string;
}

export declare interface Request {
  // 3.1. Self-Issued OpenID Provider Request
  // https://bitbucket.org/openid/connect/src/2b3f0c276b7ea9917d37dc58c935e382693c15f7/openid-connect-self-issued-v2-1_0.md

  // required for backward compatibility with OAuth2 [RFC6749]
  scope: string;
  // required for backward compatibility with OAuth2 [RFC6749]
  response_type: string;
  // required for backward compatibility with OAuth2 [RFC6749]
  client_id: string;
  id_token_hint?: string;
  claims?: string;
  // RP Registration Metadata
  // TODO: registration and registration_uri MUST NOT be used in the same request.
  // TODO: return error if SIOP doesn't support it.
  // TODO: registration(_uri) values is REQUIRED if request(_uri) are not present.
  registration?: Registration;
  // registration value by reference. MUST uses https.
  registration_uri?: string;
  // Request Object (JWT). required.
  request: string;
  request_uri?: string;
  // example value: request_uri=https%3A%2F%2Frp.example.com%2F90ce0b8a-a910-4dd0
  state?: string;
  nonce?: string;
}

// https://openid.net/specs/openid-connect-core-1_0.html#RequestObject
// https://openid.net/specs/openid-connect-core-1_0.html#AuthorizationEndpoint
export declare interface RequestObject {
  // required for backward compatibility with the OAuth2 specification [RFC6749]
  scope: string;
  // required for backward compatibility with the OAuth2 specification [RFC6749]
  response_type: string;
  // required for backward compatibility with the OAuth2 specification [RFC6749]
  // redirect URI of the RP (as per [OIDC.Core])
  client_id: string;
  redirect_uri?: string;
  // RECOMMENDED. Opaque value used to maintain state between the request and the callback.
  state?: string;

  nonce?: string;
  // other OIDC parameters: display, prompt, max_age, ui_locales, id_token_hint, login_hint, acr_values

  // parameters defined in DID-SIOP
  iss: string;
  // MUST be a DID URL referring to a verification method in the authentication section in the RP's DID Document
  kid: string;

  // Either value MUST be present in request object.
  registration?: Registration;
  registration_uri?: string;
  response_mode?: string;
  response_context?: string;
  claims?: string;
}

// https://openid.net/specs/openid-connect-core-1_0.html#IDToken
export declare interface IDToken {
  iss: 'https://self-issued.me';

  // base64url encoded representation of the thumbprint of the key in the sub_jwk Claim.
  // Thumbprint are calculated as defined in [JWT.Thumbprint].
  // c.f. [OPENID.CORE] Section 7.5
  sub: string;

  did: string;
  // It MUST contain the OAuth 2.0 client_id of the Relying Party as an audience value.
  aud: string;

  // public key to verify the ID Token.
  sub_jwk: any;
  // String value used to associate a Client session with an ID Token, and to mitigate replay attacks.
  nonce?: string;
  state?: string;

  // Issued At.
  iat: number;
  // Expiration time of this ID Token.
  exp: number;
  // other parameters in [OPENID.CORE]: auth_time, acr, amr, azp
  vp?: {};
}

// https://tools.ietf.org/html/rfc6749#section-4.2.2.1
export type OAuth2ErrorCode =
  | 'invalid_request'
  | 'unauthorized_client'
  | 'access_denied'
  | 'unsupported_response_type'
  | 'invalid_scope'
  | 'server_error'
  | 'temporarily_unavailable';

// https://openid.net/specs/openid-connect-core-1_0.html#AuthError
export type OIDCCoreErrorCode =
  | 'inteaction_required'
  | 'login_required'
  | 'account_selection_required'
  // The Authorization Server requires End-User consent.
  // This error MAY be returned when the prompt parameter value in the Authentication Request is none, but the Authentication Request cannot be completed without displaying a user interface for End-User consent.
  | 'consent_required'
  // The request_uri in the Authorization Request returns an error or contains invalid data.
  | 'invalid_request_uri'
  // The request parameter contains an invalid Request Object
  | 'invalid_request_object'
  // The OP does not support use of the request parameter
  | 'request_not_supported'
  // The OP does not support use of the request_uri parameter
  | 'request_uri_not_supported'
  // The OP does not support use of the registration parameter
  | 'registration_not_supported';

export type SIOPv2ErrorCode =
  // The Self-Issued OP does not support all of the DID methods included in did_methods_supported parameter.
  // | 'did_methods_not_supported'
  // The Self-Issued OP does not support all of the subject identifier types included in subject_identifier_types_supported parameter.
  // | 'subject_identifier_types_not_supported'
  // The Self-Issued OP does not support all of the credential formats included in credential_formats_supported parameter.
  // | 'credential_formats_not_supported'
  // The Self-Issued OP does not support more than one of the RP Registration Metadata values defined in Section 4.3. When not supported metadata values are DID methods, subject identifier types, or credential formats, more specific error message must be used.
  // | 'value_not_supported'
  // ============================== End of did-siop v0.1 error codes ==============================
  // the registration_uri in the Self-Issued OpenID Provider request returns an error or contains invalid data.
  | 'invalid_registration_uri'
  // The registration parameter contains an invalid RP Registration Metadata Object.
  | 'invalid_registration_object'
  // user cancelled the authentication request from the RP.
  | 'user_cancelled'
  // the Self-Issued OP does not support some Relying Party Registration metadata values received in the request.
  | 'registration_value_not_supported'
  // the Self-Issued OP does not support any of the Subject Syntax Types supported by the RP,
  // which were communicated in the request in the subject_syntax_types_supported parameter.
  | 'subject_syntax_types_not_supported';

export type ErrorCode = OIDCCoreErrorCode | OAuth2ErrorCode | SIOPv2ErrorCode;
/*
  Encoded as the url fragment
  example:
  HTTP/1.1 302 Found
  Location: https://client.example.com/cb#error=access_denied&state=xyz
*/
export declare interface ErrorResponse {
  error: ErrorCode;
  error_description?: string;
  error_uri?: string;

  // REQUIRED if SIOP request included the `state` parameter
  state?: string;
}
