// Note: test renderer must be required after react-native.
import * as consts from './consts';

import * as utils from '../src/sioputils';

import fetchMock from 'jest-fetch-mock';
import {SIOPRequestValidationError} from '../src/error';

fetchMock.enableMocks();

describe('sioputils without fetch()', () => {
  test('parseSIOPRequestUri()', async () => {
    const uri =
      'https://self-issued.me/?response_type=id_token&scope=openid%20did_authn&client_id=https%3A%2F%2Fs3.ap-northeast-1.amazonaws.com%2Fstatic.did-siop.develop.bunsin.io%2Frp%2Fspa-03411718b2%2Fhome.html&request_uri=https%3A%2F%2Fs3.ap-northeast-1.amazonaws.com%2Fstatic.did-siop.develop.bunsin.io%2Frp%2Fspa-03411718b2%2Frequest.jwt&nonce=ciW2oFlUI2bR&state=QvtD6GZgaPya';

    const expected = {
      response_type: 'id_token',
      scope: 'openid did_authn',
      client_id:
        'https://s3.ap-northeast-1.amazonaws.com/static.did-siop.develop.bunsin.io/rp/spa-03411718b2/home.html',
      request_uri:
        'https://s3.ap-northeast-1.amazonaws.com/static.did-siop.develop.bunsin.io/rp/spa-03411718b2/request.jwt',
      nonce: 'ciW2oFlUI2bR',
      state: 'QvtD6GZgaPya',
    };
    const parsed = utils.parseSIOPRequestUri(uri);
    expect(parsed).toMatchObject(expected);
  });
});

describe('sioputils', () => {
  const jwt = 'ey...';

  beforeEach(() => {
    // @ts-expect-error 2339
    fetch.resetMocks();
  });
  test('getRequestObject() without request or request_uri throws error', async () => {
    // @ts-expect-error 2339
    fetch.mockResponseOnce(jwt);
    const params = {};
    await expect(utils.getRequestObject(params)).rejects.toThrowError(
      new SIOPRequestValidationError('invalid_request'),
    );
  });

  test('getRequestObject(params) picks params.request when request_uri is undefined', async () => {
    const expectedRequestObject = {test: 1};
    // @ts-expect-error 2339
    fetch.mockResponseOnce(jwt);
    const params = {
      request: expectedRequestObject,
    };
    await expect(utils.getRequestObject(params)).resolves.toMatchObject(
      expectedRequestObject,
    );
  });

  test('getRequestObject() fetchs request_uri', async () => {
    // @ts-expect-error 2339
    fetch.mockResponseOnce(jwt);
    const params = {
      request_uri: 'https://example.com',
    };
    await expect(utils.getRequestObject(params)).resolves.toMatch(jwt);
  });

  test('getRequestObject() encountering HTTPS error throus error', async () => {
    const params = {
      request_uri: 'http://we-do-not-accept-http-without-tls.com',
    };
    await expect(utils.getRequestObject(params)).rejects.toThrowError(
      new SIOPRequestValidationError('invalid_request_uri'),
    );
  });

  test('getRegistration()', async () => {
    const json = JSON.stringify(consts.registration1);
    // @ts-expect-error 2339
    fetch.mockResponseOnce(json);
    const params = {
      registration_uri: 'https://example.com',
    };
    await expect(utils.getRegistration(params)).resolves.toMatchObject(
      consts.registration1,
    );
  });

  test('getRegistration() throus errors when fetching JSON with different schema', async () => {
    const invalidResistration = {scheme: 'invalid'};
    const json = JSON.stringify(invalidResistration);
    // @ts-expect-error 2339
    fetch.mockResponseOnce(json);
    const params = {
      registration_uri: 'https://example.com',
    };
    await expect(utils.getRegistration(params)).rejects.toThrowError(
      new SIOPRequestValidationError('invalid_registration_object'),
    );
  });

  test('getJwks()', async () => {
    const expectedJwks = {
      // copied from the following RFC.
      // https://datatracker.ietf.org/doc/html/rfc7517#appendix-A.1
      keys: [
        {
          kty: 'EC',
          crv: 'P-256',
          x: 'MKBCTNIcKUSDii11ySs3526iDZ8AiTo7Tu6KPAqv7D4',
          y: '4Etl6SRW2YiLUrN5vfvVHuhp7x8PxltmWWlbbM4IFyM',
          use: 'enc',
          kid: '1',
        },
        {
          kty: 'RSA',
          n:
            '0vx7agoebGcQSuuPiLJXZptN9nndrQmbXEps2aiAFbWhM78LhWx4cbbfAAtVT86zwu1RK7aPFFxuhDR1L6tSoc_BJECPebWKRXjBZCiFV4n3oknjhMstn64tZ_2W-5JsGY4Hc5n9yBXArwl93lqt7_RN5w6Cf0h4QyQ5v-65YGjQR0_FDW2QvzqY368QQMicAtaSqzs8KJZgnYb9c7d0zgdAZHzu6qMQvRL5hajrn1n91CbOpbISD08qNLyrdkt-bFTWhAI4vMQFh6WeZu0fM4lFd2NcRwr3XPksINHaQ-G_xBniIqbw0Ls1jF44-csFCur-kEgU8awapJzKnqDKgw',
          e: 'AQAB',
          alg: 'RS256',
          kid: '2011-04-29',
        },
      ],
    };
    // @ts-expect-error 2339
    fetch.mockResponseOnce(JSON.stringify(expectedJwks));
    const registration = {
      ...consts.registration1,
      jwks_uri: 'https://example.com',
    };
    await expect(utils.getJwks(registration)).resolves.toMatchObject(
      expectedJwks,
    );
  });
});
