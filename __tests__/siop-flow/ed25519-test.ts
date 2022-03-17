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

describe('SIOP Response Generation with An Ed25519 Key', () => {
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

  const ed25519User = {
    privateKey:
      '9eV2fPFTMZUXYw8iaHa4bIFgzFg7wBN0TGvyVfXMDuUngRf8FExyNA9n0PIxboOGzv+/KyQoycUf73xZfx1Cbg==',
    publicKey: 'J4EX_BRMcjQPZ9DyMW6Dhs7_vyskKMnFH-98WX8dQm4',
    minimalJwk: {
      kty: 'OKP',
      crv: 'Ed25519',
      // base64url-encoded public key.
      x: 'J4EX_BRMcjQPZ9DyMW6Dhs7_vyskKMnFH-98WX8dQm4',
    },
    did: 'did:stub:ed25519-user-1',
    kid: 'did:stub:ed25519-user-1#ed25519',
    signAlgorithm: 'EdDSA',
  };

  const mockedNow = 1647333754;

  const expectedIDToken =
    'eyJhbGciOiJFZERTQSIsImtpZCI6ImRpZDpzdHViOmVkMjU1MTktdXNlci0xI2VkMjU1MTkiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJodHRwczovL2V4YW1wbGUuY29tL2hvbWUiLCJkaWQiOiJkaWQ6c3R1YjplZDI1NTE5LXVzZXItMSIsImV4cCI6MTY0NzMzNzM1NCwiaWF0IjoxNjQ3MzMzNzU0LCJpc3MiOiJodHRwczovL3NlbGYtaXNzdWVkLm1lIiwic3ViIjoiVjl2cHo0bGoxUVcwNDd0MjloVzI4dlBzWVNnV0puanFQclFvUGJ0X3gwWSIsInN1Yl9qd2siOnsiY3J2IjoiRWQyNTUxOSIsImt0eSI6Ik9LUCIsIngiOiJKNEVYX0JSTWNqUVBaOUR5TVc2RGhzN192eXNrS01uRkgtOThXWDhkUW00In19.iOPKSPj2qe8iOyo-0p38h89MOeDXq1laWpE1cc7Pkm8xFeMHRDsAxb09Qc68nPuxDEaI4iZHh9UMtJ-v-x62Cg';

  const initialization = {
    kid: ed25519User.kid,
    sign: EdDSASigner(ed25519User.privateKey) as (
      data: string | Uint8Array,
    ) => Promise<string>,
    signAlgorithm: ed25519User.signAlgorithm,
    minimalJwk: ed25519User.minimalJwk,
  };

  const persona = new PersonaWithoutKey(
    ed25519User.did,
    ed25519User.kid,
    EdDSASigner(ed25519User.privateKey) as Signer,
    ed25519User.signAlgorithm,
    ed25519User.minimalJwk,
  );

  const resolve = async (did: string) => {
    return {
      didResolutionMetadata: {},
      didDocumentMetadata: {},
      didDocument: {
        '@context': [
          'https://www.w3.org/ns/did/v1',
          'https://w3id.org/security/suites/ed25519-2020/v1',
        ],
        id: ed25519User.did,
        controller: ed25519User.did,
        verificationMethod: [
          {
            id: ed25519User.kid,
            type: 'ED25519SignatureVerification',
            controller: ed25519User.did,
            publicKeyBase64: ed25519User.publicKey,
          },
        ],
      },
    };
  };

  const stubResolver = {resolve: resolve};

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

    // We here don't moch util.getIssuedAt() otherwise
    // the verification fails due to the expiration check of the id token.

    const idToken = await provider.generateIDToken(
      consts.requestObject,
      persona,
    );

    await expect(
      verifyJWT(idToken, {
        resolver: stubResolver,
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
      provider.generateResponse(ed25519User.did, initialization),
    ).resolves.toMatch(`https://example.com/home#id_token=${expectedIDToken}`);
  });
});
