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
    jwtModule.calculateJWKThumbprint.mockReturnValue(
      'V9vpz4lj1QW047t29hW28vPsYSgWJnjqPrQoPbt_x0Y',
    );
  });
  const expectedIDToken =
    'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QiLCJraWQiOiJkaWQ6c3R1Yjp1c2VyLTEjY29udHJvbGxlciJ9.eyJpc3MiOiJodHRwczovL3NlbGYtaXNzdWVkLm1lIiwic3ViIjoiVjl2cHo0bGoxUVcwNDd0MjloVzI4dlBzWVNnV0puanFQclFvUGJ0X3gwWSIsImRpZCI6ImRpZDpzdHViOnVzZXItMSIsImF1ZCI6Imh0dHBzOi8vZXhhbXBsZS5jb20vaG9tZSIsImlhdCI6MTYxNjY2OTA0NSwiZXhwIjoxNjE2NjcyNjQ1LCJzdWJfandrIjp7Imt0eSI6IkVDIiwiY3J2IjoiSy0yNTYiLCJ4IjoiQ1hnNmg1S2hrcmtjZkhaQ0hXM1UyZFZpNS1rQ0lET2FpNURBSjNmcjYxWSIsInkiOiI2YlhFZEJxTWxBNVl2VmRjc1VQOUhnU293eUwwZUh4X0w1MUNPaDlXMnpRIn19.W0L-IUYisuNC7nh0SlCtgbV7a43xehoZG1X-LBy28L60fcDc9gtni4IxllbDOI7KZ6_uSrCiuHJxGvIYYYFdag';

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
