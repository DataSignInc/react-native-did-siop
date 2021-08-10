export declare type DIDMethodPrefix = string;
export declare type SigningAlgorithm = 'RS256' | 'ES256' | 'ES256K' | 'EdDSA';
export interface Registration {
    authorization_endpoint: 'openid:';
    issuer: 'https://self-issued.me/v2';
    response_types_supported: ['id_token'];
    scopes_supported: ('openid' | 'profile' | 'email' | 'address' | 'phone')[];
    subject_types_supported: ('pairwise' | 'public')[];
    subject_identifier_types_supported: ('jkt' | DIDMethodPrefix)[];
    did_methods_supported?: DIDMethodPrefix[];
    credential_formats_supported: ('jwt' | 'jwt_vc' | 'jwt_vp' | 'ldp_vc' | 'ldp_vp')[];
    id_token_signing_alg_values_supported: SigningAlgorithm[];
    request_object_signing_alg_values_supported: ('none' | SigningAlgorithm)[];
    policy_uri?: string;
    tos_uri?: string;
    logo_uri?: string;
    redirect_uris?: string[];
    jwks_uri?: string;
    jwks?: any;
    id_token_encrypted_response_alg?: string;
    id_token_encrypted_response_enc?: string;
    did?: string;
}
export declare interface Request {
    scope: string;
    response_type: string;
    client_id: string;
    id_token_hint?: string;
    claims?: string;
    registration?: Registration;
    registration_uri?: string;
    request: string;
    request_uri?: string;
}
export declare interface RequestObject {
    scope: string;
    response_type: string;
    client_id: string;
    redirect_uri?: string;
    state?: string;
    nonce?: string;
    iss: string;
    kid: string;
    registration?: Registration;
    registration_uri?: string;
    response_mode?: string;
    response_context?: string;
    claims?: string;
}
export declare interface IDToken {
    iss: 'https://self-issued.me';
    sub: string;
    did: string;
    aud: string;
    sub_jwk: any;
    nonce?: string;
    state?: string;
    iat: number;
    exp: number;
    vp?: {};
}
export declare type OAuth2ErrorCode = 'invalid_request' | 'unauthorized_client' | 'access_denied' | 'unsupported_response_type' | 'invalid_scope' | 'server_error' | 'temporarily_unavailable';
export declare type OIDCCoreErrorCode = 'inteaction_required' | 'login_required' | 'account_selection_required' | 'consent_required' | 'invalid_request_uri' | 'invalid_request_object' | 'request_not_supported' | 'request_uri_not_supported' | 'registration_not_supported';
export declare type SIOPv2ErrorCode = 'did_methods_not_supported' | 'subject_identifier_types_not_supported' | 'credential_formats_not_supported' | 'value_not_supported' | 'invalid_registration_uri' | 'invalid_registration_object';
export declare type ErrorCode = OIDCCoreErrorCode | OAuth2ErrorCode | SIOPv2ErrorCode;
export declare interface ErrorResponse {
    error: ErrorCode;
    error_description?: string;
    error_uri?: string;
    state?: string;
}
