import {ec as EC} from 'elliptic';

import {DIDResolutionResult, ParsedDID, Resolver} from 'did-resolver';

import {getResolver as getEthrResolver} from 'ethr-did-resolver';
import {getResolver as getWebResolver} from 'web-did-resolver';

const ec = new EC('secp256k1');

import {Registration} from '../src/siop-schema';
import {JWTHeader} from 'did-jwt';

export const didUser = 'did:react-native-did-siop:user-1';

export const ed25519User = {
  privateKeyHex:
    '9702a6dd71bda7f7fdbf524b9c5dcdb8ba6aabd9df629373b0e31b46d68f67109702a6dd71bda7f7fdbf524b9c5dcdb8ba6aabd9df629373b0e31b46d68f6710',
  minimalJwk: {
    kty: 'OKP',
    crv: 'Ed25519',
    // base64url-encoded public key.
    x: 'THP2m9FHt3YXeQTSNeJBtJq3HVL7E9L7-pmuSJCqMkg',
  },
  did: 'did:stub:ed25519-user-1',
  kid: 'did:stub:ed25519-user-1#ed25519',
  signAlgorithm: 'Ed25519',
};

const privateKeyHex =
  'ad8972939fb143d476eaf05c2c15221a44ffbe7ba8e0a1ccabea644f77c5359e';

export const sekp256k1KeyOfUser1 = ec.keyFromPrivate(privateKeyHex);

const didDocOfUser1 = {
  '@context': 'https://w3id.org/did/v1',
  id: 'did:stub:user-1',
  publicKey: [
    {
      id: 'did:stub:user-1#controller',
      type: 'Secp256k1VerificationKey2018',
      controller: 'did:stub:user-1',
      publicKeyHex:
        '0209783a8792a192b91c7c76421d6dd4d9d562e7e90220339a8b90c02777ebeb56',
    },
  ],
  authentication: [
    {
      type: 'Secp256k1SignatureAuthentication2018',
      publicKey: 'did:stub:user-1#controller',
    },
  ],
};

export const client_id = 'https://example.com/home';
export const didRP = 'did:stub:rp-1';
const privateKeyHexOfRP =
  '45025037fddae0f3e7960c95eb0a8297cd108bd83abf42d158703d8fe09573a2';

const didDocumentOfRP1 = {
  '@context': 'https://w3id.org/did/v1',
  id: didRP,
  publicKey: [
    {
      id: 'did:stub:rp-1#controller',
      type: 'Secp256k1VerificationKey2018',
      controller: 'did:stub:rp-1',
      publicKeyHex:
        '03cca2a4f217d34c90e03b58ea7ed474e9aa0480c327a77f1a4acdc370475788c1',
    },
  ],
  authentication: [
    {
      type: 'Secp256k1SignatureAuthentication2018',
      publicKey: 'did:stub:rp-1#controller',
    },
  ],
};
export const registration1: Registration = {
  authorization_endpoint: 'openid:',
  issuer: 'https://self-issued.me/v2',
  response_types_supported: ['id_token'],
  scopes_supported: ['openid'],
  credential_formats_supported: ['jwt_vc'],
  subject_types_supported: ['pairwise'],
  subject_identifier_types_supported: ['did:web:', 'did:stub:'],
  id_token_signing_alg_values_supported: ['ES256K'],
  request_object_signing_alg_values_supported: ['ES256K'],
  redirect_uris: ['http://192.168.0.5:5001/home'],
  // jwks_uri:
  //   'https://uniresolver.io/1.0/identifiers/did:example:0xab;transform-keys=jwks',
  did: didRP,
};

export const requestJWT =
  'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QiLCJraWQiOiJkaWQ6c3R1YjpycC0xI2NvbnRyb2xsZXIifQ.eyJpc3MiOiJkaWQ6c3R1YjpycC0xIiwicmVzcG9uc2VfdHlwZSI6ImlkX3Rva2VuIiwic2NvcGUiOiJvcGVuaWQgZGlkX2F1dGhuIiwiY2xpZW50X2lkIjoiaHR0cHM6Ly9leGFtcGxlLmNvbS9ob21lIiwicmVnaXN0cmF0aW9uIjp7ImF1dGhvcml6YXRpb25fZW5kcG9pbnQiOiJvcGVuaWQ6IiwiaXNzdWVyIjoiaHR0cHM6Ly9zZWxmLWlzc3VlZC5tZS92MiIsInJlc3BvbnNlX3R5cGVzX3N1cHBvcnRlZCI6WyJpZF90b2tlbiJdLCJzY29wZXNfc3VwcG9ydGVkIjpbIm9wZW5pZCJdLCJjcmVkZW50aWFsX2Zvcm1hdHNfc3VwcG9ydGVkIjpbImp3dF92YyJdLCJzdWJqZWN0X3R5cGVzX3N1cHBvcnRlZCI6WyJwYWlyd2lzZSJdLCJzdWJqZWN0X2lkZW50aWZpZXJfdHlwZXNfc3VwcG9ydGVkIjpbImRpZDp3ZWI6IiwiZGlkOnN0dWI6Il0sImlkX3Rva2VuX3NpZ25pbmdfYWxnX3ZhbHVlc19zdXBwb3J0ZWQiOlsiRVMyNTZLIl0sInJlcXVlc3Rfb2JqZWN0X3NpZ25pbmdfYWxnX3ZhbHVlc19zdXBwb3J0ZWQiOlsiRVMyNTZLIl0sInJlZGlyZWN0X3VyaXMiOlsiaHR0cHM6Ly9leGFtcGxlLmNvbS9ob21lIl0sImRpZCI6ImRpZDpzdHViOnJwLTEifSwicmVkaXJlY3RfdXJpIjoiaHR0cHM6Ly9leGFtcGxlLmNvbS9ob21lIiwia2lkIjoiZGlkOnN0dWI6cnAtMSNjb250cm9sbGVyIn0.C8ls9bhZ2kgj4CGJsx4bCD6y2or5T8nIdmE2TaMXbOJa0lnLvU3oQmKaWsk8tkS-B5Rap-Fhx0DkTUrHN2XDsA';
export const request = {
  client_id: client_id,
  request: requestJWT,
  response_type: 'id_token',
  scope: 'openid did_authn',
};
export const requestObject = {
  iss: didRP,
  response_type: 'id_token',
  scope: 'openid did_authn',
  client_id: client_id,
  registration: registration1,
  kid: `${didRP}#controller`,
  redirect_uri: client_id,
};

export const jwtHeader: JWTHeader = {
  kid: `${didRP}#controller`,
  typ: 'JWT',
  alg: 'ES256K',
};

const ethrResolver = getEthrResolver({
  rpcUrl: 'https://ropsten.infura.io/v3/e0a6ac9a2c4a4722970325c36b728415',
});
const webResolver = getWebResolver();

export const resolve = async (
  did: string,
  _parsed: ParsedDID,
): Promise<DIDResolutionResult> => {
  let didDocument = null;

  switch (did) {
    case didUser:
      didDocument = didDocOfUser1;
      break;
    case didRP:
      didDocument = didDocumentOfRP1;
      break;
    default:
      return {
        didDocument: null,
        didDocumentMetadata: {},
        didResolutionMetadata: {
          error: 'notFound',
          message: 'This stub did is not defined in test code.',
        },
      };
  }

  return {
    didDocument,
    didDocumentMetadata: {},
    didResolutionMetadata: {contentType: 'application/did+ld+json'},
  };
};

export const defaultResolver = new Resolver({
  ...{stub: resolve},
  ...ethrResolver,
  ...webResolver,
});
