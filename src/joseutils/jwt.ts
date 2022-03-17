import Base64 from 'crypto-js/enc-base64';
import sha256 from 'crypto-js/sha256';
import * as didJWT from 'did-jwt';
import {Resolver} from 'did-resolver';
import {base64ToBase64url} from './encoding';
export interface JWTHeader {
  typ: string;
  alg: string;
  kid: string;
}

export const verifyJWT = async (jwt: string, resolver: Resolver) => {
  await didJWT.verifyJWT(jwt, {
    resolver,
    // audience: did,
  });
};

export const calculateJWKThumbprint = (jwk: {}) => {
  const base64Thumbprint = sha256(JSON.stringify(jwk)).toString(Base64);
  return base64ToBase64url(base64Thumbprint);
};
