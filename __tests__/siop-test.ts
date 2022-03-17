import fetchMock from 'jest-fetch-mock';

import {PersonaWithoutKey} from '../src/persona';
import Provider from '../src/siop';
import * as consts from './consts';

import * as utils from '../src/sioputils';
import * as jwtModule from '../src/jwt';
import {SIOPRequestValidationError} from '../src/error';
import {ES256KSigner} from 'did-jwt';
import {getMinimalJWK} from '../src/jwk';
jest.mock('../src/sioputils');
jest.mock('../src/jwt');

fetchMock.enableMocks();

describe('siop', () => {
  beforeEach(() => {
    // @ts-expect-error 2339
    fetch.resetMocks();
    // @ts-expect-error 2339
    jwtModule.verifyJWT.mockResolvedValue(undefined);
    // @ts-expect-error 2339
    jwtModule.calculateJWKThumbprint.mockReturnValue(
      'V9vpz4lj1QW047t29hW28vPsYSgWJnjqPrQoPbt_x0Y',
    );
  });
  const expectedIDToken =
    'eyJhbGciOiJFUzI1NksiLCJraWQiOiJkaWQ6c3R1Yjp1c2VyLTEjY29udHJvbGxlciIsInR5cCI6IkpXVCJ9.eyJhdWQiOiJodHRwczovL2V4YW1wbGUuY29tL2hvbWUiLCJkaWQiOiJkaWQ6c3R1Yjp1c2VyLTEiLCJleHAiOjE2MTY2NzI2NDUsImlhdCI6MTYxNjY2OTA0NSwiaXNzIjoiaHR0cHM6Ly9zZWxmLWlzc3VlZC5tZSIsInN1YiI6IlY5dnB6NGxqMVFXMDQ3dDI5aFcyOHZQc1lTZ1dKbmpxUHJRb1BidF94MFkiLCJzdWJfandrIjp7ImNydiI6IlAtMjU2SyIsImt0eSI6IkVDIiwieCI6IkNYZzZoNUtoa3JrY2ZIWkNIVzNVMmRWaTUta0NJRE9haTVEQUozZnI2MVkiLCJ5IjoiNmJYRWRCcU1sQTVZdlZkY3NVUDlIZ1Nvd3lMMGVIeF9MNTFDT2g5VzJ6USJ9fQ.PtngTyhpEwFVrtPFxp3WpgJ22o61GKN1zAFdCzf0YzdR6GwUF_Tkgot3FnYto8QauwRaUztfkQZDC0BovPWR6A';

  const persona = new PersonaWithoutKey(
    'did:stub:user-1',
    'did:stub:user-1#controller',
    ES256KSigner(consts.sekp256k1KeyOfUser1.getPrivate().toString('hex')),
    'ES256K',
    getMinimalJWK(consts.sekp256k1KeyOfUser1.getPublic()),
  );
  const did = 'did:stub:user-1';

  const expiresIn = 3600;

  test('receiveRequest() raises no errors', async () => {
    const provider = new Provider(expiresIn, consts.defaultResolver);
    // @ts-expect-error 2339
    utils.getRequestObject.mockReturnValueOnce(consts.requestJWT);
    await expect(
      provider.receiveRequest(consts.request),
    ).resolves.toMatchObject({client_id: consts.client_id});
  });

  test('receiveRequest() accepts request_uri', async () => {
    // @ts-expect-error 2339
    utils.getRequestObject.mockReturnValueOnce(consts.requestJWT);
    const provider = new Provider(expiresIn, consts.defaultResolver);
    const request = {request_uri: 'https://example.com', ...consts.request};
    request.request = undefined;

    await expect(
      provider.receiveRequest(consts.request),
    ).resolves.toMatchObject({client_id: consts.client_id});
  });

  test('receiveRequest() raises errors on validation failure', async () => {
    const invalidRequest = {...consts.request};
    invalidRequest.response_type = 'invalid';
    const provider = new Provider(expiresIn, consts.defaultResolver);

    await expect(provider.receiveRequest(invalidRequest)).rejects.toStrictEqual(
      new SIOPRequestValidationError('unsupported_response_type'),
    );
  });

  test('generate ID Token', async () => {
    const provider = new Provider(expiresIn, consts.defaultResolver);

    // @ts-expect-error 2322
    utils.getIssuedAt.mockReturnValueOnce(1616669045);
    await expect(
      provider.generateIDToken(consts.requestObject, persona),
    ).resolves.toBe(expectedIDToken);
  });

  test('generate ID Token with additionalFields', async () => {
    const provider = new Provider(expiresIn, consts.defaultResolver);
    // mock the sign() method
    persona.sign = (payload: any) => payload;

    // @ts-expect-error 2322
    utils.getIssuedAt.mockReturnValueOnce(1616669045);
    await expect(
      provider.generateIDToken(consts.requestObject, persona, {
        test: 'test',
        test2: 2,
        iss: 'invalid',
      }),
    ).resolves.toMatchObject({
      aud: 'https://example.com/home',
      did: 'did:stub:user-1',
      exp: 1616672645,
      iat: 1616669045,
      iss: 'https://self-issued.me',
      nonce: undefined,
      state: undefined,
      sub: 'V9vpz4lj1QW047t29hW28vPsYSgWJnjqPrQoPbt_x0Y',
      sub_jwk: {
        crv: 'P-256K',
        kty: 'EC',
        x: 'CXg6h5KhkrkcfHZCHW3U2dVi5-kCIDOai5DAJ3fr61Y',
        y: '6bXEdBqMlA5YvVdcsUP9HgSowyL0eHx_L51COh9W2zQ',
      },
      test: 'test',
      test2: 2,
    });
  });

  test('generate response', async () => {
    const provider = new Provider(expiresIn, consts.defaultResolver);
    // @ts-expect-error 2322
    utils.getRequestObject.mockReturnValueOnce(consts.requestJWT);
    // @ts-expect-error 2322
    utils.getIssuedAt.mockReturnValueOnce(1616669045);
    await provider.receiveRequest(consts.request);

    await expect(
      provider.generateResponse(did, {
        kid: 'did:stub:user-1#controller',
        sign: ES256KSigner(
          consts.sekp256k1KeyOfUser1.getPrivate().toString('hex'),
        ) as (data: string | Uint8Array) => Promise<string>,
        alg: 'ES256K',
        minimalJwk: getMinimalJWK(consts.sekp256k1KeyOfUser1.getPublic()),
      }),
    ).resolves.toMatch(`https://example.com/home#id_token=${expectedIDToken}`);
  });
});
