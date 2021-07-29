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
    // jwtModule.calculateJWKThumprint.mockReturnValue(
    //   'UCKoaM6I76JIu46bGUaCfMSnQwMUIuKmoRF0bnYzLd4',
    // );
  });
  const expectedIDToken =
    'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QiLCJraWQiOiJkaWQ6c3R1Yjp1c2VyLTEjY29udHJvbGxlciJ9.eyJpc3MiOiJodHRwczovL3NlbGYtaXNzdWVkLm1lIiwiZGlkIjoiZGlkOnN0dWI6dXNlci0xIiwiYXVkIjoiaHR0cHM6Ly9leGFtcGxlLmNvbS9ob21lIiwiaWF0IjoxNjE2NjY5MDQ1LCJleHAiOjE2MTY2NzI2NDUsInN1Yl9qd2siOnsia3R5IjoiRUMiLCJjcnYiOiJLLTI1NiIsIngiOiJDWGc2aDVLaGtya2NmSFpDSFczVTJkVmk1LWtDSURPYWk1REFKM2ZyNjFZIiwieSI6IjZiWEVkQnFNbEE1WXZWZGNzVVA5SGdTb3d5TDBlSHhfTDUxQ09oOVcyelEifX0.b8zHL5rQTLlfJYBLPoHNVllMjoQvfw9Iml-nTTPUW2ZM7OrmRSioXqZ2bSHLPoGQ7rnlX7f1jFsOgVxbPFg5cA';

  const persona = new Persona(
    'did:stub:user-1',
    new ECKeyPair(consts.sekp256k1KeyOfUser1),
  );

  const did = 'did:stub:user-1';

  const expiresIn = 3600;

  test('receiveRequest() raises no errors', async () => {
    const provider = new Provider(expiresIn, consts.defaultResolver);
    // @ts-expect-error 2339
    utils.getRequestObject.mockReturnValueOnce(consts.requestJWT);
    await expect(provider.receiveRequest(consts.request)).resolves.toBe(
      consts.client_id,
    );
  });

  test('receiveRequest() accepts request_uri', async () => {
    // @ts-expect-error 2339
    utils.getRequestObject.mockReturnValueOnce(consts.requestJWT);
    const provider = new Provider(expiresIn, consts.defaultResolver);
    const request = {request_uri: 'https://example.com', ...consts.request};
    request.request = undefined;

    await expect(provider.receiveRequest(consts.request)).resolves.toBe(
      consts.client_id,
    );
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

  test('generate response', async () => {
    const provider = new Provider(expiresIn, consts.defaultResolver);
    // @ts-expect-error 2322
    utils.getRequestObject.mockReturnValueOnce(consts.requestJWT);
    // @ts-expect-error 2322
    utils.getIssuedAt.mockReturnValueOnce(1616669045);
    await provider.receiveRequest(consts.request);

    await expect(
      provider.generateResponse(did, consts.sekp256k1KeyOfUser1),
    ).resolves.toMatch(`https://example.com/home#id_token=${expectedIDToken}`);
  });
});
