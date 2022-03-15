import fetchMock from 'jest-fetch-mock';

import {PersonaWithoutKey} from '../../src/persona';
import Provider from '../../src/siop';
import * as consts from '../consts';

import * as utils from '../../src/sioputils';
import * as jwtModule from '../../src/jwt';
import {EdDSASigner, Signer, verifyJWT} from 'did-jwt';

jest.mock('../../src/sioputils');
jest.mock('../../src/jwt');

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

  const mockedNow = 1647333754;

  const expectedIDToken =
    'eyJhbGciOiJFZERTQSIsImtpZCI6ImRpZDpzdHViOmVkMjU1MTktdXNlci0xI2VkMjU1MTkiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJodHRwczovL2V4YW1wbGUuY29tL2hvbWUiLCJkaWQiOiJkaWQ6c3R1YjplZDI1NTE5LXVzZXItMSIsImV4cCI6MTY0NzMzNzM1NCwiaWF0IjoxNjQ3MzMzNzU0LCJpc3MiOiJodHRwczovL3NlbGYtaXNzdWVkLm1lIiwic3ViIjoiVjl2cHo0bGoxUVcwNDd0MjloVzI4dlBzWVNnV0puanFQclFvUGJ0X3gwWSIsInN1Yl9qd2siOnsiY3J2IjoiRWQyNTUxOSIsImt0eSI6Ik9LUCIsIngiOiJKNEVYX0JSTWNqUVBaOUR5TVc2RGhzN192eXNrS01uRkgtOThXWDhkUW00In19.iOPKSPj2qe8iOyo-0p38h89MOeDXq1laWpE1cc7Pkm8xFeMHRDsAxb09Qc68nPuxDEaI4iZHh9UMtJ-v-x62Cg';

  const initialization = {
    kid: 'did:stub:ed25519-user-1#ed25519',
    sign: EdDSASigner(consts.ed25519User.privateKey) as (
      data: string | Uint8Array,
    ) => Promise<string>,
    signAlgorithm: 'EdDSA',
    minimalJwk: consts.ed25519User.minimalJwk,
  };

  const persona = new PersonaWithoutKey(
    'did:stub:ed25519-user-1',
    'did:stub:ed25519-user-1#ed25519',
    EdDSASigner(consts.ed25519User.privateKey) as Signer,
    'EdDSA',
    consts.ed25519User.minimalJwk,
  );

  const did = 'did:stub:ed25519-user-1';

  const expiresIn = 3600;

  test('generate ID Token', async () => {
    const provider = new Provider(expiresIn, consts.defaultResolver);

    // @ts-expect-error 2322
    utils.getIssuedAt.mockReturnValueOnce(mockedNow);

    await expect(
      provider.generateIDToken(consts.requestObject, persona),
    ).resolves.toBe(expectedIDToken);
  });

  test('able to verify ID token', async () => {
    const provider = new Provider(expiresIn, consts.defaultResolver);

    // @ts-expect-error 2322
    utils.getIssuedAt.mockReturnValueOnce(mockedNow);

    const idToken = await provider.generateIDToken(
      consts.requestObject,
      persona,
    );

    const resolver = async (did: string) => {
      return {
        didResolutionMetadata: {},
        didDocumentMetadata: {},
        didDocument: {
          '@context': [
            'https://www.w3.org/ns/did/v1',
            'https://w3id.org/security/suites/ed25519-2020/v1',
          ],
          id: 'did:stub:ed25519-user-1',
          controller: 'did:stub:ed25519-user-1',
          verificationMethod: [
            {
              id: 'did:stub:ed25519-user-1#ed25519',
              type: 'ED25519SignatureVerification',
              controller: 'did:stub:ed25519-user-1',
              publicKeyBase64: 'J4EX_BRMcjQPZ9DyMW6Dhs7_vyskKMnFH-98WX8dQm4',
            },
          ],
        },
      };
    };

    await expect(
      verifyJWT(idToken, {
        resolver: {resolve: resolver},
        audience: consts.client_id,
      }),
    ).resolves.toBeDefined();
  });

  test('generate response', async () => {
    const provider = new Provider(expiresIn, consts.defaultResolver);
    // @ts-expect-error 2322
    utils.getRequestObject.mockReturnValueOnce(consts.requestJWT);
    // @ts-expect-error 2322
    utils.getIssuedAt.mockReturnValueOnce(mockedNow);
    await provider.receiveRequest(consts.request);

    await expect(
      provider.generateResponse(did, initialization),
    ).resolves.toMatch(`https://example.com/home#id_token=${expectedIDToken}`);
  });
});
