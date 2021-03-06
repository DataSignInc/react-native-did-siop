import {base64ToBase64url} from './keys/encoding';

export const getMinimalJWK = (publicKey: any) => {
  const encodePoint = (point: Buffer) =>
    base64ToBase64url(point.toString('base64'));

  return {
    // The kty and crv values are defined here for secp256k1:
    //   https://datatracker.ietf.org/doc/html/draft-jones-webauthn-secp256k1-00#section-2
    kty: 'EC',
    crv: 'P-256K',
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
