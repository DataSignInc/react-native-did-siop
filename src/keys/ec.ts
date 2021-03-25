// Elliptic Curve （楕円曲線） Digital Signature Algorithm
import keyto from '@trust/keyto';
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
    const a = keyto.from(publicKey, 'blk').toJwk('public');
    console.log(a);
    return a;
  }
}

const error = 'not authenticated';
