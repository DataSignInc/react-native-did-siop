// Note: test renderer must be required after react-native.
import * as consts from './consts';

import * as utils from '../src/sioputils';

import fetchMock from 'jest-fetch-mock';

fetchMock.enableMocks();

describe('sioputils', () => {
  const jwt = 'ey...';

  beforeEach(() => {
    // @ts-expect-error 2339
    fetch.resetMocks();
  });
  test('getRequestObject()', async () => {
    // @ts-expect-error 2339
    fetch.mockResponseOnce(jwt);
    const params = {
      request_uri: 'https://example.com',
    };
    await expect(utils.getRequestObject(params)).resolves.toMatch(jwt);
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
    console.log(registration);
    await expect(utils.getJwks(registration)).resolves.toMatchObject(
      expectedJwks,
    );
  });
});
