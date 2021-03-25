import {ec as EC} from 'elliptic';

const ec = new EC('secp256k1');

import {Registration} from '../src/siop-schema';
import {JWTHeader} from 'did-jwt';

export const didUser =
  'did:web:assets-datasign.s3-ap-northeast-1.amazonaws.com:siop-test:user';
export const privateKeyHex =
  '9702a6dd71bda7f7fdbf524b9c5dcdb8ba6aabd9df629373b0e31b46d68f6710';
export const sekp256k1Key = ec.keyFromPrivate(privateKeyHex);
export const client_id = 'http://192.168.0.5:5001/home';
export const didRP =
  'did:web:assets-datasign.s3-ap-northeast-1.amazonaws.com:siop-test:rp';
export const registration1: Registration = {
  authorization_endpoint: 'openid:',
  issuer: 'https://self-issued.me/v2',
  response_types_supported: ['id_token'],
  scopes_supported: ['openid', 'profile', 'email', 'address', 'phone'],
  credential_formats_supported: ['jwt_vc'],
  subject_types_supported: ['pairwise'],
  subject_identifier_types_supported: ['did:web:', 'did:ion:'],
  id_token_signing_alg_values_supported: ['ES256K', 'EdDSA', 'RS256'],
  request_object_signing_alg_values_supported: ['ES256', 'ES256K'],
  redirect_uris: ['http://192.168.0.5:5001/home'],
  // jwks_uri:
  //   'https://uniresolver.io/1.0/identifiers/did:example:0xab;transform-keys=jwks',
  did: didRP,
};

export const requestJWT =
  'eyJhbGciOiJFUzI1NkstUiIsInR5cCI6IkpXVCIsImtpZCI6ImRpZDp3ZWI6YXNzZXRzLWRhdGFzaWduLnMzLWFwLW5vcnRoZWFzdC0xLmFtYXpvbmF3cy5jb206c2lvcC10ZXN0OnJwI2NvbnRyb2xsZXIifQ.eyJpc3MiOiJkaWQ6d2ViOmFzc2V0cy1kYXRhc2lnbi5zMy1hcC1ub3J0aGVhc3QtMS5hbWF6b25hd3MuY29tOnNpb3AtdGVzdDpycCIsInJlc3BvbnNlX3R5cGUiOiJpZF90b2tlbiIsInNjb3BlIjoib3BlbmlkIGRpZF9hdXRobiIsImNsaWVudF9pZCI6Imh0dHA6Ly8xOTIuMTY4LjAuNTo1MDAxL2hvbWUiLCJyZWdpc3RyYXRpb24iOnsiYXV0aG9yaXphdGlvbl9lbmRwb2ludCI6Im9wZW5pZDoiLCJpc3N1ZXIiOiJodHRwczovL3NlbGYtaXNzdWVkLm1lL3YyIiwicmVzcG9uc2VfdHlwZXNfc3VwcG9ydGVkIjpbImlkX3Rva2VuIl0sInNjb3Blc19zdXBwb3J0ZWQiOlsib3BlbmlkIiwicHJvZmlsZSIsImVtYWlsIiwiYWRkcmVzcyIsInBob25lIl0sImNyZWRlbnRpYWxfZm9ybWF0c19zdXBwb3J0ZWQiOlsiand0X3ZjIl0sInN1YmplY3RfdHlwZXNfc3VwcG9ydGVkIjpbInBhaXJ3aXNlIl0sInN1YmplY3RfaWRlbnRpZmllcl90eXBlc19zdXBwb3J0ZWQiOlsiZGlkOndlYjoiLCJkaWQ6aW9uOiJdLCJpZF90b2tlbl9zaWduaW5nX2FsZ192YWx1ZXNfc3VwcG9ydGVkIjpbIkVTMjU2SyIsIkVkRFNBIiwiUlMyNTYiXSwicmVxdWVzdF9vYmplY3Rfc2lnbmluZ19hbGdfdmFsdWVzX3N1cHBvcnRlZCI6WyJFUzI1NiIsIkVTMjU2SyJdLCJyZWRpcmVjdF91cmlzIjpbImh0dHA6Ly8xOTIuMTY4LjAuNTo1MDAxL2hvbWUiXSwiZGlkIjoiZGlkOndlYjphc3NldHMtZGF0YXNpZ24uczMtYXAtbm9ydGhlYXN0LTEuYW1hem9uYXdzLmNvbTpzaW9wLXRlc3Q6cnAifSwicmVkaXJlY3RfdXJpIjoiaHR0cDovLzE5Mi4xNjguMC41OjUwMDEvaG9tZSIsImtpZCI6ImRpZDp3ZWI6YXNzZXRzLWRhdGFzaWduLnMzLWFwLW5vcnRoZWFzdC0xLmFtYXpvbmF3cy5jb206c2lvcC10ZXN0OnJwI2NvbnRyb2xsZXIifQ.Be3FZx029xlEY7HfaSuzF88nxDtYktbZc0JtkF23dAhMZFLQJ6BcuzG950ySG7yjJ5dJZ5_ZqlKVyQpfzk8lhwA';

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
