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
      validator.validateOIDCQueryParameters(consts.request),
    ).resolves.toBeUndefined();
  });

  test('client_id', () => {
    expect(
      validator.validateClientId(consts.request, consts.requestObject),
    ).toBeUndefined();
  });

  test('response_type', () => {
    expect(() => validator.validateResponseType('invalid')).toThrow(
      new SIOPRequestValidationError('unsupported_response_type'),
    );
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
});
