import base64url from 'base64url';
import Base64 from 'crypto-js/enc-base64';
import sha256 from 'crypto-js/sha256';
import * as didJWT from 'did-jwt';
import {Resolver} from 'did-resolver';
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

export const calculateJWKThumprint = (jwk: {}) => {
  const base64Thumbprint = sha256(JSON.stringify(jwk)).toString(Base64);
  return base64url.fromBase64(base64Thumbprint);
};
