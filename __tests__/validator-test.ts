import 'react-native';
import React from 'react';

import * as JWT from '../src/jwt';
import {Registration} from '../src/siop-schema';
import SIOPValidator from '../src/validator';
import {JWTHeader} from 'did-jwt';
import {SIOPRequestValidationError} from '../src/error';

jest.mock('../src/jwt');

const didRP =
  'did:web:assets-datasign.s3-ap-northeast-1.amazonaws.com:siop-test:rp';
const registration1: Registration = {
  authorization_endpoint: 'openid:',
  issuer: 'https://self-issued.me/v2',
  response_types_supported: ['id_token'],
  scopes_supported: ['openid', 'profile', 'email', 'address', 'phone'],
  credential_formats_supported: ['jwt_vc'],
  subject_types_supported: ['pairwise'],
  subject_identifier_types_supported: ['did:web:', 'did:ion:'],
  id_token_signing_alg_values_supported: ['ES256K', 'EdDSA', 'RS256'],
  request_object_signing_alg_values_supported: ['ES256', 'ES256K'],
  redirect_uris: ['http://192.168.0.5:5001/home'],
  // jwks_uri:
  //   'https://uniresolver.io/1.0/identifiers/did:example:0xab;transform-keys=jwks',
  did: didRP,
};

describe('request validation', () => {
  const validator = new SIOPValidator();

  const requestJWT =
    'eyJhbGciOiJFUzI1NkstUiIsInR5cCI6IkpXVCIsImtpZCI6ImRpZDp3ZWI6YXNzZXRzLWRhdGFzaWduLnMzLWFwLW5vcnRoZWFzdC0xLmFtYXpvbmF3cy5jb206c2lvcC10ZXN0OnJwI2NvbnRyb2xsZXIifQ.eyJpc3MiOiJkaWQ6d2ViOmFzc2V0cy1kYXRhc2lnbi5zMy1hcC1ub3J0aGVhc3QtMS5hbWF6b25hd3MuY29tOnNpb3AtdGVzdDpycCIsInJlc3BvbnNlX3R5cGUiOiJpZF90b2tlbiIsInNjb3BlIjoib3BlbmlkIGRpZF9hdXRobiIsImNsaWVudF9pZCI6Imh0dHA6Ly8xOTIuMTY4LjAuNTo1MDAxL2hvbWUiLCJyZWdpc3RyYXRpb24iOnsiYXV0aG9yaXphdGlvbl9lbmRwb2ludCI6Im9wZW5pZDoiLCJpc3N1ZXIiOiJodHRwczovL3NlbGYtaXNzdWVkLm1lL3YyIiwicmVzcG9uc2VfdHlwZXNfc3VwcG9ydGVkIjpbImlkX3Rva2VuIl0sInNjb3Blc19zdXBwb3J0ZWQiOlsib3BlbmlkIiwicHJvZmlsZSIsImVtYWlsIiwiYWRkcmVzcyIsInBob25lIl0sImNyZWRlbnRpYWxfZm9ybWF0c19zdXBwb3J0ZWQiOlsiand0X3ZjIl0sInN1YmplY3RfdHlwZXNfc3VwcG9ydGVkIjpbInBhaXJ3aXNlIl0sInN1YmplY3RfaWRlbnRpZmllcl90eXBlc19zdXBwb3J0ZWQiOlsiZGlkOndlYjoiLCJkaWQ6aW9uOiJdLCJpZF90b2tlbl9zaWduaW5nX2FsZ192YWx1ZXNfc3VwcG9ydGVkIjpbIkVTMjU2SyIsIkVkRFNBIiwiUlMyNTYiXSwicmVxdWVzdF9vYmplY3Rfc2lnbmluZ19hbGdfdmFsdWVzX3N1cHBvcnRlZCI6WyJFUzI1NiIsIkVTMjU2SyJdLCJyZWRpcmVjdF91cmlzIjpbImh0dHA6Ly8xOTIuMTY4LjAuNTo1MDAxL2hvbWUiXSwiZGlkIjoiZGlkOndlYjphc3NldHMtZGF0YXNpZ24uczMtYXAtbm9ydGhlYXN0LTEuYW1hem9uYXdzLmNvbTpzaW9wLXRlc3Q6cnAifSwicmVkaXJlY3RfdXJpIjoiaHR0cDovLzE5Mi4xNjguMC41OjUwMDEvaG9tZSIsImtpZCI6ImRpZDp3ZWI6YXNzZXRzLWRhdGFzaWduLnMzLWFwLW5vcnRoZWFzdC0xLmFtYXpvbmF3cy5jb206c2lvcC10ZXN0OnJwI2NvbnRyb2xsZXIifQ.Be3FZx029xlEY7HfaSuzF88nxDtYktbZc0JtkF23dAhMZFLQJ6BcuzG950ySG7yjJ5dJZ5_ZqlKVyQpfzk8lhwA';

  const request = {
    client_id: 'http://192.168.0.5:5001/home',
    request: requestJWT,
    response_type: 'id_token',
    scope: 'openid did_authn',
  };
  const requestObject = {
    iss: didRP,
    response_type: 'id_token',
    scope: 'openid did_authn',
    client_id: 'http://192.168.0.5:5001/home',
    registration: registration1,
    kid: `${didRP}#controller`,
    redirect_uri: 'http://192.168.0.5:5001/home',
  };

  const jwtHeader: JWTHeader = {
    kid: `${didRP}#controller`,
    typ: 'JWT',
    alg: 'ES256K',
  };

  test('iss', () => {
    validator.validateIss('test');
  });
  test.each([['openid did_authn'], ['did_authn openid']])(
    'valid scope',
    (scope) => {
      validator.validateScope(scope);
    },
  );

  test.each([['openid'], ['did_authn'], ['']])('invalid scope', (scope) => {
    expect(() => validator.validateScope(scope)).toThrow('invalid_scope');
  });

  test('request.iss == registration.did', () => {
    validator.validateIss(didRP, registration1);
  });

  test.each([['did:example:123']])('invalid iss', (iss) => {
    // @ts-expect-error 2322
    expect(() => validator.validateIss(iss, {did: 'did:example:12'})).toThrow(
      'invalid_request_object',
    );
  });

  test('validate OIDC Parameters', async () => {
    await expect(
      validator.validateOIDCParameters(request, requestObject),
    ).resolves.toBeUndefined();
  });

  test('client_id', () => {
    expect(validator.validateClientId(request, requestObject)).toBeUndefined();
  });

  test('did authn', () => {
    validator.validateDIDAuthnParameters(
      requestObject,
      registration1,
      jwtHeader,
    );
  });

  test('did authn error due to invalid kid', () => {
    const jwtHeaderWithInvalidKid = {...jwtHeader, kid: 'invalid'};

    expect(() =>
      validator.validateDIDAuthnParameters(
        requestObject,
        registration1,
        jwtHeaderWithInvalidKid,
      ),
    ).toThrow(new SIOPRequestValidationError('invalid_request'));
  });

  test('e2e', async () => {
    // @ts-expect-error 2322
    JWT.verifyJWT.mockResolvedValue(undefined);
    await validator.validateSIOPRequest(request);
  });
  //   test('validate OAuth 2 Parameters', async () => {
  //     const request = {
  //       client_id: 'http://192.168.0.6:5001/home',
  //       request:
  //         'eyJhbGciOiJFUzI1NkstUiIsInR5cCI6IkpXVCIsImtpZCI6ImRpZDpldGhyOjB4QTUxRTgyODFjMjAxY2Q2RWQ0ODhDMzcwMTg4MkE0NEIxODcxREFkNiNjb250cm9sbGVyIn0.eyJpc3MiOiJkaWQ6ZXRocjoweEE1MUU4MjgxYzIwMWNkNkVkNDg4QzM3MDE4ODJBNDRCMTg3MURBZDYiLCJyZXNwb25zZV90eXBlIjoiaWRfdG9rZW4iLCJzY29wZSI6Im9wZW5pZCBkaWRfYXV0aG4iLCJjbGllbnRfaWQiOiJodHRwOi8vMTkyLjE2OC4wLjY6NTAwMS9ob21lIiwicmVnaXN0cmF0aW9uIjp7ImF1dGhvcml6YXRpb25fZW5kcG9pbnQiOiJvcGVuaWQ6IiwiaXNzdWVyIjoiaHR0cHM6Ly9zZWxmLWlzc3VlZC5tZS92MiIsInJlc3BvbnNlX3R5cGVzX3N1cHBvcnRlZCI6WyJpZF90b2tlbiJdLCJzY29wZXNfc3VwcG9ydGVkIjpbIm9wZW5pZCIsInByb2ZpbGUiLCJlbWFpbCIsImFkZHJlc3MiLCJwaG9uZSJdLCJzdWJqZWN0X3R5cGVzX3N1cHBvcnRlZCI6WyJwYWlyd2lzZSJdLCJzdWJqZWN0X2lkZW50aWZpZXJfdHlwZXNfc3VwcG9ydGVkIjpbImRpZDp3ZWI6IiwiZGlkOmlvbjoiXSwiaWRfdG9rZW5fc2lnbmluZ19hbGdfdmFsdWVzX3N1cHBvcnRlZCI6WyJFUzI1NkstUiIsIkVkRFNBIiwiUlMyNTYiXSwicmVxdWVzdF9vYmplY3Rfc2lnbmluZ19hbGdfdmFsdWVzX3N1cHBvcnRlZCI6WyJFUzI1NiIsIkVTMjU2SyJdLCJyZWRpcmVjdF91cmlzIjpbImh0dHA6Ly8xOTIuMTY4LjAuNjo1MDAxL2hvbWUiXSwiandrc191cmkiOiJodHRwczovL3VuaXJlc29sdmVyLmlvLzEuMC9pZGVudGlmaWVycy9kaWQ6ZXhhbXBsZToweGFiO3RyYW5zZm9ybS1rZXlzPWp3a3MiLCJkaWQiOiJkaWQ6ZXRocjoweEE1MUU4MjgxYzIwMWNkNkVkNDg4QzM3MDE4ODJBNDRCMTg3MURBZDYifSwicmVkaXJlY3RfdXJpIjoiaHR0cDovLzE5Mi4xNjguMC42OjUwMDEvaG9tZSJ9.aFh44Jxo3XuljnhYG8KffbRlglcx-hoCoEF5YC1qIm_FCVoQ2YVhFRb7rxjefSaGDGuQFsREBujoDWTlSRLNsgE',
  //       response_type: 'id_token',
  //       scope: 'openid did_authn',
  //     };
  //     expect(() => provider.validateOAuth2Parameters(request));
  //   });
});
