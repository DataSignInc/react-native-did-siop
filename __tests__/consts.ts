import {ec as EC} from 'elliptic';

import {
  DIDDocument,
  DIDResolutionResult,
  DIDResolver,
  ParsedDID,
  Resolver,
} from 'did-resolver';

import {getResolver as getEthrResolver} from 'ethr-did-resolver';
import {getResolver as getWebResolver} from 'web-did-resolver';

const ec = new EC('secp256k1');

import {Registration} from '../src/siop-schema';
import {JWTHeader} from 'did-jwt';

export let didUser =
  'did:web:assets-datasign.s3-ap-northeast-1.amazonaws.com:siop-test:user';
const didUser1 = 'did:react-native-did-siop:user-1';
didUser = didUser1;
export let privateKeyHex =
  '9702a6dd71bda7f7fdbf524b9c5dcdb8ba6aabd9df629373b0e31b46d68f6710';

const privateKeyOfUser1 =
  'ad8972939fb143d476eaf05c2c15221a44ffbe7ba8e0a1ccabea644f77c5359e';

privateKeyHex = privateKeyOfUser1;
export const sekp256k1KeyOfUser1 = ec.keyFromPrivate(privateKeyOfUser1);

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
export const sekp256k1Key = ec.keyFromPrivate(
  '9702a6dd71bda7f7fdbf524b9c5dcdb8ba6aabd9df629373b0e31b46d68f6710',
);
export const client_id = 'https://example.com/home';
export let didRP =
  'did:web:assets-datasign.s3-ap-northeast-1.amazonaws.com:siop-test:rp';
const didRP1 = 'did:stub:rp-1';
didRP = didRP1;

const didDocumentOfRP1 = {
  '@context': 'https://w3id.org/did/v1',
  id: 'did:stub:rp-1',
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

export const requestJWT1 =
  'eyJhbGciOiJFUzI1NkstUiIsInR5cCI6IkpXVCIsImtpZCI6ImRpZDp3ZWI6YXNzZXRzLWRhdGFzaWduLnMzLWFwLW5vcnRoZWFzdC0xLmFtYXpvbmF3cy5jb206c2lvcC10ZXN0OnJwI2NvbnRyb2xsZXIifQ.eyJpc3MiOiJkaWQ6d2ViOmFzc2V0cy1kYXRhc2lnbi5zMy1hcC1ub3J0aGVhc3QtMS5hbWF6b25hd3MuY29tOnNpb3AtdGVzdDpycCIsInJlc3BvbnNlX3R5cGUiOiJpZF90b2tlbiIsInNjb3BlIjoib3BlbmlkIGRpZF9hdXRobiIsImNsaWVudF9pZCI6Imh0dHA6Ly8xOTIuMTY4LjAuNTo1MDAxL2hvbWUiLCJyZWdpc3RyYXRpb24iOnsiYXV0aG9yaXphdGlvbl9lbmRwb2ludCI6Im9wZW5pZDoiLCJpc3N1ZXIiOiJodHRwczovL3NlbGYtaXNzdWVkLm1lL3YyIiwicmVzcG9uc2VfdHlwZXNfc3VwcG9ydGVkIjpbImlkX3Rva2VuIl0sInNjb3Blc19zdXBwb3J0ZWQiOlsib3BlbmlkIiwicHJvZmlsZSIsImVtYWlsIiwiYWRkcmVzcyIsInBob25lIl0sImNyZWRlbnRpYWxfZm9ybWF0c19zdXBwb3J0ZWQiOlsiand0X3ZjIl0sInN1YmplY3RfdHlwZXNfc3VwcG9ydGVkIjpbInBhaXJ3aXNlIl0sInN1YmplY3RfaWRlbnRpZmllcl90eXBlc19zdXBwb3J0ZWQiOlsiZGlkOndlYjoiLCJkaWQ6aW9uOiJdLCJpZF90b2tlbl9zaWduaW5nX2FsZ192YWx1ZXNfc3VwcG9ydGVkIjpbIkVTMjU2SyIsIkVkRFNBIiwiUlMyNTYiXSwicmVxdWVzdF9vYmplY3Rfc2lnbmluZ19hbGdfdmFsdWVzX3N1cHBvcnRlZCI6WyJFUzI1NiIsIkVTMjU2SyJdLCJyZWRpcmVjdF91cmlzIjpbImh0dHA6Ly8xOTIuMTY4LjAuNTo1MDAxL2hvbWUiXSwiZGlkIjoiZGlkOndlYjphc3NldHMtZGF0YXNpZ24uczMtYXAtbm9ydGhlYXN0LTEuYW1hem9uYXdzLmNvbTpzaW9wLXRlc3Q6cnAifSwicmVkaXJlY3RfdXJpIjoiaHR0cDovLzE5Mi4xNjguMC41OjUwMDEvaG9tZSIsImtpZCI6ImRpZDp3ZWI6YXNzZXRzLWRhdGFzaWduLnMzLWFwLW5vcnRoZWFzdC0xLmFtYXpvbmF3cy5jb206c2lvcC10ZXN0OnJwI2NvbnRyb2xsZXIifQ.Be3FZx029xlEY7HfaSuzF88nxDtYktbZc0JtkF23dAhMZFLQJ6BcuzG950ySG7yjJ5dJZ5_ZqlKVyQpfzk8lhwA';

export const requestJWT =
  'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QiLCJraWQiOiJkaWQ6c3R1YjpycC0xI2NvbnRyb2xsZXIifQ.eyJpc3MiOiJkaWQ6c3R1YjpycC0xIiwicmVzcG9uc2VfdHlwZSI6ImlkX3Rva2VuIiwic2NvcGUiOiJvcGVuaWQgZGlkX2F1dGhuIiwiY2xpZW50X2lkIjoiaHR0cHM6Ly9leGFtcGxlLmNvbS9ob21lIiwicmVnaXN0cmF0aW9uIjp7ImF1dGhvcml6YXRpb25fZW5kcG9pbnQiOiJvcGVuaWQ6IiwiaXNzdWVyIjoiaHR0cHM6Ly9zZWxmLWlzc3VlZC5tZS92MiIsInJlc3BvbnNlX3R5cGVzX3N1cHBvcnRlZCI6WyJpZF90b2tlbiJdLCJzY29wZXNfc3VwcG9ydGVkIjpbIm9wZW5pZCJdLCJjcmVkZW50aWFsX2Zvcm1hdHNfc3VwcG9ydGVkIjpbImp3dF92YyJdLCJzdWJqZWN0X3R5cGVzX3N1cHBvcnRlZCI6WyJwYWlyd2lzZSJdLCJzdWJqZWN0X2lkZW50aWZpZXJfdHlwZXNfc3VwcG9ydGVkIjpbImRpZDp3ZWI6IiwiZGlkOnN0dWI6Il0sImlkX3Rva2VuX3NpZ25pbmdfYWxnX3ZhbHVlc19zdXBwb3J0ZWQiOlsiRVMyNTZLIl0sInJlcXVlc3Rfb2JqZWN0X3NpZ25pbmdfYWxnX3ZhbHVlc19zdXBwb3J0ZWQiOlsiRVMyNTZLIl0sInJlZGlyZWN0X3VyaXMiOlsiaHR0cHM6Ly9leGFtcGxlLmNvbS9ob21lIl0sImRpZCI6ImRpZDpzdHViOnJwLTEifSwicmVkaXJlY3RfdXJpIjoiaHR0cHM6Ly9leGFtcGxlLmNvbS9ob21lIiwia2lkIjoiZGlkOnN0dWI6cnAtMSNjb250cm9sbGVyIn0.C8ls9bhZ2kgj4CGJsx4bCD6y2or5T8nIdmE2TaMXbOJa0lnLvU3oQmKaWsk8tkS-B5Rap-Fhx0DkTUrHN2XDsA';
export const request = {
  client_id: client_id,
  request: requestJWT,
  response_type: 'id_token',
  scope: 'openid did_authn',
};
export const requestObject = {
  iss: didRP1,
  response_type: 'id_token',
  scope: 'openid did_authn',
  client_id: client_id,
  registration: registration1,
  kid: `${didRP1}#controller`,
  redirect_uri: client_id,
};

export const jwtHeader: JWTHeader = {
  kid: `${didRP1}#controller`,
  typ: 'JWT',
  alg: 'ES256K',
};

const ethrDid = getEthrResolver({
  rpcUrl: 'https://ropsten.infura.io/v3/e0a6ac9a2c4a4722970325c36b728415',
});
const webResolver = getWebResolver();

export const resolve = async (
  did: string,
  _parsed: ParsedDID,
): Promise<DIDResolutionResult> => {
  let didDocument = null;
  let err;

  switch (did) {
    case didUser1:
      didDocument = didDocOfUser1;
      break;
    case didRP1:
      didDocument = didDocumentOfRP1;
      break;
  }

  // TODO: this excludes the use of query params
  const docIdMatchesDid = didDocument?.id === did;
  if (!docIdMatchesDid) {
    err = 'resolver_error: DID document id does not match requested did';
    // break // uncomment this when adding more checks
  }

  const contentType =
    typeof didDocument?.['@context'] !== 'undefined'
      ? 'application/did+ld+json'
      : 'application/did+json';

  if (err) {
    return {
      didDocument: null,
      didDocumentMetadata: {},
      didResolutionMetadata: {
        error: 'notFound',
        message: 'This stub did is not defined in test code.',
      },
    };
  } else {
    return {
      didDocument,
      didDocumentMetadata: {},
      didResolutionMetadata: {contentType},
    };
  }
};

export const defaultResolver = new Resolver({
  ...{stub: resolve},
  ...ethrDid,
  ...webResolver,
});

// RP-1
// {
//   "@context": "https://w3id.org/did/v1",
//   "id": "did:stub:rp-1",
//   "publicKey": [
//     {
//       "id": "did:stub:rp-1#controller",
//       "type": "Secp256k1VerificationKey2018",
//       "controller": "did:stub:rp-1",
//       "publicKeyHex": "03cca2a4f217d34c90e03b58ea7ed474e9aa0480c327a77f1a4acdc370475788c1"
//     }
//   ],
//   "authentication": [
//     {
//       "type": "Secp256k1SignatureAuthentication2018",
//       "publicKey": "did:stub:rp-1#controller"
//     }
//   ]
// }
// waiting for upload completion...
// {
//   "did": "did:stub:rp-1",
//   "privateKeyHex": "45025037fddae0f3e7960c95eb0a8297cd108bd83abf42d158703d8fe09573a2",
//   "jwt": "eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QiLCJraWQiOiJkaWQ6c3R1YjpycC0xI2NvbnRyb2xsZXIifQ.eyJpc3MiOiJkaWQ6c3R1YjpycC0xIiwicmVzcG9uc2VfdHlwZSI6ImlkX3Rva2VuIiwic2NvcGUiOiJvcGVuaWQgZGlkX2F1dGhuIiwiY2xpZW50X2lkIjoiaHR0cHM6Ly9leGFtcGxlLmNvbS9ob21lIiwicmVnaXN0cmF0aW9uIjp7ImF1dGhvcml6YXRpb25fZW5kcG9pbnQiOiJvcGVuaWQ6IiwiaXNzdWVyIjoiaHR0cHM6Ly9zZWxmLWlzc3VlZC5tZS92MiIsInJlc3BvbnNlX3R5cGVzX3N1cHBvcnRlZCI6WyJpZF90b2tlbiJdLCJzY29wZXNfc3VwcG9ydGVkIjpbIm9wZW5pZCJdLCJjcmVkZW50aWFsX2Zvcm1hdHNfc3VwcG9ydGVkIjpbImp3dF92YyJdLCJzdWJqZWN0X3R5cGVzX3N1cHBvcnRlZCI6WyJwYWlyd2lzZSJdLCJzdWJqZWN0X2lkZW50aWZpZXJfdHlwZXNfc3VwcG9ydGVkIjpbImRpZDp3ZWI6IiwiZGlkOnN0dWI6Il0sImlkX3Rva2VuX3NpZ25pbmdfYWxnX3ZhbHVlc19zdXBwb3J0ZWQiOlsiRVMyNTZLIl0sInJlcXVlc3Rfb2JqZWN0X3NpZ25pbmdfYWxnX3ZhbHVlc19zdXBwb3J0ZWQiOlsiRVMyNTZLIl0sInJlZGlyZWN0X3VyaXMiOlsiaHR0cHM6Ly9leGFtcGxlLmNvbS9ob21lIl0sImRpZCI6ImRpZDpzdHViOnJwLTEifSwicmVkaXJlY3RfdXJpIjoiaHR0cHM6Ly9leGFtcGxlLmNvbS9ob21lIiwia2lkIjoiZGlkOnN0dWI6cnAtMSNjb250cm9sbGVyIn0.C8ls9bhZ2kgj4CGJsx4bCD6y2or5T8nIdmE2TaMXbOJa0lnLvU3oQmKaWsk8tkS-B5Rap-Fhx0DkTUrHN2XDsA",
//   "doc": "{\n  \"@context\": \"https://w3id.org/did/v1\",\n  \"id\": \"did:stub:rp-1\",\n  \"publicKey\": [\n    {\n      \"id\": \"did:stub:rp-1#controller\",\n      \"type\": \"Secp256k1VerificationKey2018\",\n      \"controller\": \"did:stub:rp-1\",\n      \"publicKeyHex\": \"03cca2a4f217d34c90e03b58ea7ed474e9aa0480c327a77f1a4acdc370475788c1\"\n    }\n  ],\n  \"authentication\": [\n    {\n      \"type\": \"Secp256k1SignatureAuthentication2018\",\n      \"publicKey\": \"did:stub:rp-1#controller\"\n    }\n  ]\n}",
//   "snippet": "<div data-widget-host=\"datasign-bunsin-habitat\">\n  <script type=\"text/props\">\n    {\"jwtUri\": \"https://s3.ap-northeast-1.amazonaws.com/static.did-siop.develop.bunsin.io/rp/03cca2a4f2/request.jwt\", \"redirectUri\": \"https://s3.ap-northeast-1.amazonaws.com/static.did-siop.develop.bunsin.io/rp/03cca2a4f2/home.html\"}\n  </script>\n</div>\n<script src=\"https://s3.ap-northeast-1.amazonaws.com/static.did-siop.develop.bunsin.io/assets/siop-qrcode.js\"></script>"
// }
