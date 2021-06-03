import fetchMock from 'jest-fetch-mock';

import {ECKeyPair} from '../src/keys/ec';
import Persona from '../src/persona';
import Provider from '../src/siop';
import * as consts from './consts';

import * as utils from '../src/sioputils';
import * as jwtModule from '../src/jwt';
import {SIOPRequestValidationError} from '../src/error';
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
    jwtModule.calculateJWKThumprint.mockReturnValue(
      'UCKoaM6I76JIu46bGUaCfMSnQwMUIuKmoRF0bnYzLd4',
    );
  });
  const expectedIDToken =
    'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QiLCJraWQiOiJkaWQ6ZXhhbXBsZTphYiNjb250cm9sbGVyIn0.eyJpc3MiOiJodHRwczovL3NlbGYtaXNzdWVkLm1lIiwic3ViIjoiVUNLb2FNNkk3NkpJdTQ2YkdVYUNmTVNuUXdNVUl1S21vUkYwYm5ZekxkNCIsImRpZCI6ImRpZDpleGFtcGxlOmFiIiwiYXVkIjoiaHR0cDovLzE5Mi4xNjguMC41OjUwMDEvaG9tZSIsImlhdCI6MTYxNjY2OTA0NSwiZXhwIjoxNjE2NjcyNjQ1LCJzdWJfandrIjp7Imt0eSI6IkVDIiwiY3J2IjoiSy0yNTYiLCJ4IjoiclQ2MW52dXoyTENSeng0VzFFZkV3R0FpVmdDdU42YUtUVy1QWjQ2cUQxRSIsInkiOiJBQkdsMVByNnY3blZ3dmFhMWcxNG01TTdvR2dxczIzRnBmNzgweC1WSnBNIn19.CUxOR31FRKo0RVkStp6dY3goWSKsC722b3dcAfgBKVGRuQF8GRJMgTi9WV1m_C739tN2ynT9K7IZP10iO95fvQ';

  const persona = new Persona(
    'did:example:ab',
    new ECKeyPair(consts.sekp256k1Key),
  );

  const did = 'did:example:ab';

  const expiresIn = 3600;

  test('receiveRequest() raises no errors', async () => {
    const provider = new Provider(expiresIn);
    // @ts-expect-error 2339
    utils.getRequestObject.mockReturnValueOnce(consts.requestJWT);
    await expect(provider.receiveRequest(consts.request)).resolves.toBe(
      consts.client_id,
    );
  });

  test('receiveRequest() accepts request_uri', async () => {
    // @ts-expect-error 2339
    utils.getRequestObject.mockReturnValueOnce(consts.requestJWT);
    const provider = new Provider(expiresIn);
    const request = {request_uri: 'https://example.com', ...consts.request};
    request.request = undefined;

    await expect(provider.receiveRequest(consts.request)).resolves.toBe(
      consts.client_id,
    );
  });

  test('receiveRequest() raises errors on validation failure', async () => {
    const invalidRequest = {...consts.request};
    invalidRequest.response_type = 'invalid';
    const provider = new Provider(expiresIn);

    await expect(provider.receiveRequest(invalidRequest)).rejects.toStrictEqual(
      new SIOPRequestValidationError('unsupported_response_type'),
    );
  });

  test('generate ID Token', async () => {
    const provider = new Provider(expiresIn);

    // @ts-expect-error 2322
    utils.getIssuedAt.mockReturnValueOnce(1616669045);
    await expect(
      provider.generateIDToken(consts.requestObject, persona),
    ).resolves.toBe(expectedIDToken);
  });

  test('generate response', async () => {
    const provider = new Provider(expiresIn);
    // @ts-expect-error 2322
    utils.getRequestObject.mockReturnValueOnce(consts.requestJWT);
    // @ts-expect-error 2322
    utils.getIssuedAt.mockReturnValueOnce(1616669045);
    await provider.receiveRequest(consts.request);

    await expect(
      provider.generateResponse(did, consts.sekp256k1Key),
    ).resolves.toMatch(
      `http://192.168.0.5:5001/home#id_token=${expectedIDToken}`,
    );
  });
});
