import queryString from 'query-string';

import {ErrorCode, ErrorResponse} from './siop-schema';

export class SIOPError extends Error {
  private error: ErrorCode;
  private state?: string;
  private clientId?: string;
  constructor(error: ErrorCode, clientId?: string, state?: string) {
    super(error);
    this.error = error;
    this.clientId = clientId;
    this.state = state;
  }

  setState(state?: string) {
    this.state = state;
  }

  setClientId(clientId?: string) {
    this.clientId = clientId;
  }

  toResponse() {
    const oauth2Code = [
      'invalid_request',
      'unauthorized_client',
      'access_denied',
      'unsupported_response_type',
      'invalid_scope',
      'server_error',
      'temporarily_unavailable',
    ];

    const oidcCode = [
      'inteaction_required',
      'login_required',
      'account_selection_required',
      'consent_required',
      'invalid_request_uri',
      'invalid_request_object',
      'request_not_supported',
      'request_uri_not_supported',
      'registration_not_supported',
    ];

    const siopCode = [
      'did_methods_not_supported',
      'subject_identifier_types_not_supported',
      'credential_formats_not_supported',
      'value_not_supported',
      'invalid_registration_uri',
      'invalid_registration_object',
    ];

    let params: ErrorResponse = {error: this.error, state: this.state};
    if (oauth2Code.includes(this.error)) {
      params.error_uri = 'https://tools.ietf.org/html/rfc6749#section-4.2.2.1';
    } else if (oidcCode.includes(this.error)) {
      params.error_uri =
        'https://openid.net/specs/openid-connect-core-1_0.html#AuthError';
    } else if (siopCode.includes(this.error)) {
      // still in draft
      params.error_uri = '';
    }
    const qs = queryString.stringify(params);
    return `${this.clientId}#${qs}`;
  }
}

export class SIOPRequestValidationError extends SIOPError {
  public invalidField?: string;
  public invalidValue?: any;

  constructor(
    error: ErrorCode,
    clientId?: string,
    state?: string,
    invalidField?: string,
    invalidValue?: any,
  ) {
    super(error, clientId, state);
    this.invalidField = invalidField;
    this.invalidValue = invalidValue;
  }
}

export class SIOPResponseGenerationError extends SIOPError {}
