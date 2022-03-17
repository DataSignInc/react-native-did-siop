import {base64ToBase64url, encodeUint8ArrayInBase64url} from './encoding';

export interface MinimalJwkSecp256k1 {
  kty: 'EC';
  crv: 'secp256k1';
  x: string;
  y: string;
}

export interface MinimalJwkEd25519 {
  kty: 'OKP';
  crv: 'Ed25519';
  x: string;
}

export type MinimalJwk = MinimalJwkEd25519 | MinimalJwkSecp256k1;

export const getMinimalJWK = (publicKey: any): MinimalJwkSecp256k1 => {
  const encodePoint = (point: Buffer) =>
    base64ToBase64url(point.toString('base64'));

  return {
    // The kty and crv values are defined here for secp256k1:
    //   https://datatracker.ietf.org/doc/html/draft-jones-webauthn-secp256k1-00#section-2
    kty: 'EC',
    crv: 'secp256k1',
    // We must specify the length parameter (32) to avoid 00-truncated Buffer instances.
    // Example:
    //   Expected:
    //     <Buffer 00 11 a5 d4 fa fa bf b9 d5 c2 f6 9a d6 0d 78 9b 93 3b a0 68 2a b3 6d c5 a5 fe fc d3 1f 95 26 93>
    //   Wrong (When the length parameter is omitted):
    //     <Buffer 11 a5 d4 fa fa bf b9 d5 c2 f6 9a d6 0d 78 9b 93 3b a0 68 2a b3 6d c5 a5 fe fc d3 1f 95 26 93>
    x: encodePoint(publicKey.getX().toArrayLike(Buffer, 'be', 32)),
    y: encodePoint(publicKey.getY().toArrayLike(Buffer, 'be', 32)),
  };
};

const convertAlgorithm2Curve = (alg: 'ES256K' | 'EdDSA') => {
  const algCrvMap = {
    ES256K: 'secp256k1',
    EdDSA: 'Ed25519',
  };
  if (alg in algCrvMap) {
    return algCrvMap[alg];
  }
  throw Error('algorithm not supported');
};

export const deriveMinimalJwk = (
  publicKeyDer: Uint8Array,
  alg: 'ES256K' | 'EdDSA',
): MinimalJwk => {
  const crv = convertAlgorithm2Curve(alg);
  switch (crv) {
    case 'secp256k1':
      const length = 64;
      const boundaryIndex = length / 2;
      const x = publicKeyDer.slice(0, boundaryIndex);
      const y = publicKeyDer.slice(boundaryIndex);
      return {
        kty: 'EC',
        crv,
        x: encodeUint8ArrayInBase64url(x),
        y: encodeUint8ArrayInBase64url(y),
      };
    case 'Ed25519':
      return {kty: 'OKP', crv, x: encodeUint8ArrayInBase64url(publicKeyDer)};
    default:
      throw Error('curve not supported');
  }
};

const encodeInBase64url = (point: Buffer) =>
  base64ToBase64url(point.toString('base64'));
