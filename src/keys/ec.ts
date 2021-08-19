// Elliptic Curve （楕円曲線） Digital Signature Algorithm
import {createJWS, ES256KSigner} from 'did-jwt';
import {ec as EC} from 'elliptic';
import {Buffer} from 'buffer';
import {base64ToBase64url} from './encoding';
// const curve = 'secp256k1';
// const ec = new EC(curve);

export class ECKeyPair {
  private keyPair: EC.KeyPair;

  constructor(keyPair: EC.KeyPair) {
    this.keyPair = keyPair;
  }

  async sign(payload: any, did: string) {
    const privateKey = this.keyPair.getPrivate();
    const signer = ES256KSigner(privateKey.toString('hex'));
    return await createJWS(payload, signer, {
      alg: 'ES256K',
      typ: 'JWT',
      kid: did + '#controller',
    });
  }

  getJWK() {
    const publicKey = this.keyPair.getPublic();
    const encodePoint = (point: Buffer) =>
      base64ToBase64url(point.toString('base64'));

    return {
      kty: 'EC',
      crv: 'K-256',
      // We must specify the length parameter (32) to avoid 00-truncated Buffer instances.
      // Example:
      //   Expected:
      //     <Buffer 00 11 a5 d4 fa fa bf b9 d5 c2 f6 9a d6 0d 78 9b 93 3b a0 68 2a b3 6d c5 a5 fe fc d3 1f 95 26 93>
      //   Wrong (When the length parameter is omitted):
      //     <Buffer 11 a5 d4 fa fa bf b9 d5 c2 f6 9a d6 0d 78 9b 93 3b a0 68 2a b3 6d c5 a5 fe fc d3 1f 95 26 93>
      x: encodePoint(publicKey.getX().toArrayLike(Buffer, 'be', 32)),
      y: encodePoint(publicKey.getY().toArrayLike(Buffer, 'be', 32)),
    };
  }
}

const error = 'not authenticated';
