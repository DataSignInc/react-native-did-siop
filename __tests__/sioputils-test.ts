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
    const expectedJwks = {test: 1};
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
