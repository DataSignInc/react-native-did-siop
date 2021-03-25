import 'react-native';
import React from 'react';

import {Registration} from '../src/siop-schema';
import {SIOPValidator} from '../src/sioputils';

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
    validator.validateIss('did:example:12', {did: 'did:example:12'});
  });

  test.each([['did:example:123']])('invalid iss', (iss) => {
    // @ts-expect-error 2322
    expect(() => validator.validateIss(iss, {did: 'did:example:12'})).toThrow(
      'invalid_request_object',
    );
  });

  test('validate OIDC Parameters', async () => {
    const request = {
      client_id: 'http://192.168.0.6:5001/home',
      request:
        'eyJhbGciOiJFUzI1NkstUiIsInR5cCI6IkpXVCIsImtpZCI6ImRpZDpldGhyOjB4QTUxRTgyODFjMjAxY2Q2RWQ0ODhDMzcwMTg4MkE0NEIxODcxREFkNiNjb250cm9sbGVyIn0.eyJpc3MiOiJkaWQ6ZXRocjoweEE1MUU4MjgxYzIwMWNkNkVkNDg4QzM3MDE4ODJBNDRCMTg3MURBZDYiLCJyZXNwb25zZV90eXBlIjoiaWRfdG9rZW4iLCJzY29wZSI6Im9wZW5pZCBkaWRfYXV0aG4iLCJjbGllbnRfaWQiOiJodHRwOi8vMTkyLjE2OC4wLjY6NTAwMS9ob21lIiwicmVnaXN0cmF0aW9uIjp7ImF1dGhvcml6YXRpb25fZW5kcG9pbnQiOiJvcGVuaWQ6IiwiaXNzdWVyIjoiaHR0cHM6Ly9zZWxmLWlzc3VlZC5tZS92MiIsInJlc3BvbnNlX3R5cGVzX3N1cHBvcnRlZCI6WyJpZF90b2tlbiJdLCJzY29wZXNfc3VwcG9ydGVkIjpbIm9wZW5pZCIsInByb2ZpbGUiLCJlbWFpbCIsImFkZHJlc3MiLCJwaG9uZSJdLCJzdWJqZWN0X3R5cGVzX3N1cHBvcnRlZCI6WyJwYWlyd2lzZSJdLCJzdWJqZWN0X2lkZW50aWZpZXJfdHlwZXNfc3VwcG9ydGVkIjpbImRpZDp3ZWI6IiwiZGlkOmlvbjoiXSwiaWRfdG9rZW5fc2lnbmluZ19hbGdfdmFsdWVzX3N1cHBvcnRlZCI6WyJFUzI1NkstUiIsIkVkRFNBIiwiUlMyNTYiXSwicmVxdWVzdF9vYmplY3Rfc2lnbmluZ19hbGdfdmFsdWVzX3N1cHBvcnRlZCI6WyJFUzI1NiIsIkVTMjU2SyJdLCJyZWRpcmVjdF91cmlzIjpbImh0dHA6Ly8xOTIuMTY4LjAuNjo1MDAxL2hvbWUiXSwiandrc191cmkiOiJodHRwczovL3VuaXJlc29sdmVyLmlvLzEuMC9pZGVudGlmaWVycy9kaWQ6ZXhhbXBsZToweGFiO3RyYW5zZm9ybS1rZXlzPWp3a3MiLCJkaWQiOiJkaWQ6ZXRocjoweEE1MUU4MjgxYzIwMWNkNkVkNDg4QzM3MDE4ODJBNDRCMTg3MURBZDYifSwicmVkaXJlY3RfdXJpIjoiaHR0cDovLzE5Mi4xNjguMC42OjUwMDEvaG9tZSJ9.aFh44Jxo3XuljnhYG8KffbRlglcx-hoCoEF5YC1qIm_FCVoQ2YVhFRb7rxjefSaGDGuQFsREBujoDWTlSRLNsgE',
      response_type: 'id_token',
      scope: 'openid did_authn',
    };
    const requestObject = {
      iss: 'did:ethr:0xA51E8281c201cd6Ed488C3701882A44B1871DAd6',
      response_type: 'id_token',
      scope: 'openid did_authn',
      client_id: 'http://192.168.0.6:5001/home',
      registration: {
        authorization_endpoint: 'openid:',
        issuer: 'https://self-issued.me/v2',
        response_types_supported: ['id_token'],
        credential_formats_supported: ['jwt_vc'],

        scopes_supported: ['openid', 'profile', 'email', 'address', 'phone'],
        subject_types_supported: ['pairwase'],
        subject_identifier_types_supported: ['did:web:', 'did:ion:'],
        id_token_signing_alg_values_supported: ['ES256K', 'EdDSA', 'RS256'],
        request_object_signing_alg_values_supported: ['ES256', 'ES256K'],
        redirect_uris: ['http://192.168.0.6:5001/home'],
        jwks_uri:
          'https://uniresolver.io/1.0/identifiers/did:example:0xab;transform-keys=jwks',
        did: 'did:ethr:0xA51E8281c201cd6Ed488C3701882A44B1871DAd6',
      } as Registration,
      kid: 'did:ethr:0xA51E8281c201cd6Ed488C3701882A44B1871DAd6#controller',
      redirect_uri: 'http://192.168.0.6:5001/home',
    };

    expect(
      await validator.validateOIDCParameters(request, requestObject),
    ).toBeUndefined();
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
