// Elliptic Curve （楕円曲線） Digital Signature Algorithm
import {createJWS, ES256KSigner} from 'did-jwt';
import {ec as EC} from 'elliptic';
import {Buffer} from 'buffer';
import {base64Tobase64url} from './encoding';
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
      base64Tobase64url(point.toString('base64'));

    return {
      kty: 'EC',
      crv: 'secp256k1',
      x: encodePoint(publicKey.getX().toArrayLike(Buffer)),
      y: encodePoint(publicKey.getY().toArrayLike(Buffer)),
    };
  }
}

const error = 'not authenticated';
