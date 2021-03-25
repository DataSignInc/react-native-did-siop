import * as JWT from '../src/jwt';
import SIOPValidator from '../src/validator';
import {SIOPRequestValidationError} from '../src/error';
import * as consts from './consts';

jest.mock('../src/jwt');

describe('request validation', () => {
  const validator = new SIOPValidator();

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
    validator.validateIss(consts.didRP, consts.registration1);
  });

  test.each([['did:example:123']])('invalid iss', (iss) => {
    // @ts-expect-error 2322
    expect(() => validator.validateIss(iss, {did: 'did:example:12'})).toThrow(
      'invalid_request_object',
    );
  });

  test('validate OIDC Parameters', async () => {
    await expect(
      validator.validateOIDCParameters(consts.request, consts.requestObject),
    ).resolves.toBeUndefined();
  });

  test('client_id', () => {
    expect(
      validator.validateClientId(consts.request, consts.requestObject),
    ).toBeUndefined();
  });

  test('did authn', () => {
    validator.validateDIDAuthnParameters(
      consts.requestObject,
      consts.registration1,
      consts.jwtHeader,
    );
  });

  test('did authn error due to invalid kid', () => {
    const jwtHeaderWithInvalidKid = {...consts.jwtHeader, kid: 'invalid'};

    expect(() =>
      validator.validateDIDAuthnParameters(
        consts.requestObject,
        consts.registration1,
        jwtHeaderWithInvalidKid,
      ),
    ).toThrow(new SIOPRequestValidationError('invalid_request'));
  });

  test('e2e', async () => {
    // @ts-expect-error 2322
    JWT.verifyJWT.mockResolvedValue(undefined);
    await validator.validateSIOPRequest(consts.request);
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
