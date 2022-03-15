import fetchMock from 'jest-fetch-mock';

import {PersonaWithoutKey} from '../../src/persona';
import Provider from '../../src/siop';
import * as consts from '../consts';

import * as utils from '../../src/sioputils';
import * as jwtModule from '../../src/jwt';
import {
  createJWT,
  decodeJWT,
  EdDSASigner,
  Signer,
  verifyJWS,
  verifyJWT,
} from 'did-jwt';

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
  const expectedIDToken =
    'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QiLCJraWQiOiJkaWQ6c3R1Yjp1c2VyLTEjY29udHJvbGxlciJ9.eyJpc3MiOiJodHRwczovL3NlbGYtaXNzdWVkLm1lIiwic3ViIjoiVjl2cHo0bGoxUVcwNDd0MjloVzI4dlBzWVNnV0puanFQclFvUGJ0X3gwWSIsImRpZCI6ImRpZDpzdHViOnVzZXItMSIsImF1ZCI6Imh0dHBzOi8vZXhhbXBsZS5jb20vaG9tZSIsImlhdCI6MTYxNjY2OTA0NSwiZXhwIjoxNjE2NjcyNjQ1LCJzdWJfandrIjp7Imt0eSI6IkVDIiwiY3J2IjoiUC0yNTZLIiwieCI6IkNYZzZoNUtoa3JrY2ZIWkNIVzNVMmRWaTUta0NJRE9haTVEQUozZnI2MVkiLCJ5IjoiNmJYRWRCcU1sQTVZdlZkY3NVUDlIZ1Nvd3lMMGVIeF9MNTFDT2g5VzJ6USJ9fQ._VL3g6H49Ym7doVnlq8tz8JmvDzbZ7YCr-GSVR_mFlEDglVvafz4HGlFr51KtmymQcGHacqbqvNW9VrrDn173w';

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

  //   test('receiveRequest() raises no errors', async () => {
  //     const provider = new Provider(expiresIn, consts.defaultResolver);
  //     // @ts-expect-error 2339
  //     utils.getRequestObject.mockReturnValueOnce(consts.requestJWT);
  //     await expect(
  //       provider.receiveRequest(consts.request),
  //     ).resolves.toMatchObject({client_id: consts.client_id});
  //   });

  //   test('receiveRequest() accepts request_uri', async () => {
  //     // @ts-expect-error 2339
  //     utils.getRequestObject.mockReturnValueOnce(consts.requestJWT);
  //     const provider = new Provider(expiresIn, consts.defaultResolver);
  //     const request = {request_uri: 'https://example.com', ...consts.request};
  //     request.request = undefined;

  //     await expect(
  //       provider.receiveRequest(consts.request),
  //     ).resolves.toMatchObject({client_id: consts.client_id});
  //   });

  //   test('receiveRequest() raises errors on validation failure', async () => {
  //     const invalidRequest = {...consts.request};
  //     invalidRequest.response_type = 'invalid';
  //     const provider = new Provider(expiresIn, consts.defaultResolver);

  //     await expect(provider.receiveRequest(invalidRequest)).rejects.toStrictEqual(
  //       new SIOPRequestValidationError('unsupported_response_type'),
  //     );
  //   });

  test('generate ID Token', async () => {
    const provider = new Provider(expiresIn, consts.defaultResolver);

    // @ts-expect-error 2322
    utils.getIssuedAt.mockReturnValueOnce(1647333754);

    const idToken = await provider.generateIDToken(
      consts.requestObject,
      persona,
    );
    console.log(idToken);

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

    // const jwt = await createJWT(
    //   {test: 'test'},
    //   {
    //     alg: 'EdDSA',
    //     issuer: 'did:stub:ed25519-user-1',
    //     signer: EdDSASigner(consts.ed25519User.privateKeyHex),
    //     canonicalize: true,
    //   },
    // );

    console.log(await decodeJWT(idToken));

    await verifyJWT(idToken, {
      resolver: {resolve: resolver},
      audience: 'https://example.com/home',
    });

    // await expect(idToken).resolves.toBe(expectedIDToken);
  });

  //   test('generate ID Token with additionalFields', async () => {
  //     const provider = new Provider(expiresIn, consts.defaultResolver);
  //     // mock the sign() method
  //     persona.sign = (payload: any) => payload;

  //     // @ts-expect-error 2322
  //     utils.getIssuedAt.mockReturnValueOnce(1616669045);
  //     await expect(
  //       provider.generateIDToken(consts.requestObject, persona, {
  //         test: 'test',
  //         test2: 2,
  //         iss: 'invalid',
  //       }),
  //     ).resolves.toMatchObject({
  //       aud: 'https://example.com/home',
  //       did: 'did:stub:user-1',
  //       exp: 1616672645,
  //       iat: 1616669045,
  //       iss: 'https://self-issued.me',
  //       nonce: undefined,
  //       state: undefined,
  //       sub: 'V9vpz4lj1QW047t29hW28vPsYSgWJnjqPrQoPbt_x0Y',
  //       sub_jwk: {
  //         kty: 'OKP',
  //         crv: 'Ed25519',
  //         // base64url-encoded public key.
  //         x: 'THP2m9FHt3YXeQTSNeJBtJq3HVL7E9L7-pmuSJCqMkg',
  //       },
  //       test: 'test',
  //       test2: 2,
  //     });
  //   });

  test('generate response', async () => {
    const provider = new Provider(expiresIn, consts.defaultResolver);
    // @ts-expect-error 2322
    utils.getRequestObject.mockReturnValueOnce(consts.requestJWT);
    // @ts-expect-error 2322
    utils.getIssuedAt.mockReturnValueOnce(1616669045);
    await provider.receiveRequest(consts.request);

    await expect(
      provider.generateResponse(did, initialization),
    ).resolves.toMatch(`https://example.com/home#id_token=${expectedIDToken}`);
  });
});
