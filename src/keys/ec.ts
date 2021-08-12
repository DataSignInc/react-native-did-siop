// Elliptic Curve （楕円曲線） Digital Signature Algorithm
import {createJWS, ES256KSigner} from 'did-jwt';
import {ec as EC} from 'elliptic';

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
    const publicKey = this.keyPair.getPublic('hex');
    return {
      kty: 'EC',
      crv: 'secp256k1',
      x: this.keyPair.getPublic().getX(),
      y: this.keyPair.getPublic().getY(),
    }
  }
}

const error = 'not authenticated';
