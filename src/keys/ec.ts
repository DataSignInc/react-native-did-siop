// Elliptic Curve （楕円曲線） Digital Signature Algorithm
import keyto from '@trust/keyto';
import {createJWS, ES256KSigner} from 'did-jwt';
import {ec as EC} from 'elliptic';
import {getItem, setItem} from '../keychain';
import {debug} from '../log';
import {fromPemToHex, generateJwkFromPrivateKeyPEM} from './utils';

const curve = 'secp256k1';
const ec = new EC(curve);

export const getPublicKey = (privateKey: string) => {
  const keyPair = ec.keyFromPrivate(privateKey);
  const publicKey = keyPair.getPublic();
  return publicKey;
};

export const saveECKey = async (id: string, privateKeyHex: string) => {
  const key = keyto.from(privateKeyHex, 'blk').toString('pem', 'private_pkcs1');
  await setItem(id, key);
  debug(key);
};

const error = 'not authenticated';
class ECKey {
  private keyID: string;
  private privateKey?: string;
  private keyPair?: EC.KeyPair;

  constructor(keyID: string) {
    this.keyID = keyID;
    this.privateKey;
  }

  async authenticateKeyOwner() {
    this.privateKey = await getItem(this.keyID);
    return this.privateKey;
  }

  async generateAndSaveKey() {
    this.keyPair = ec.genKeyPair({
      entropy: [
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        10,
        11,
        12,
        13,
        14,
        15,
        16,
        17,
        18,
        19,
        20,
        21,
        22,
        23,
        24,
        25,
      ],
    });
    const privateKey = this.keyPair.getPrivate('hex');
    const pem = keyto.from(privateKey, 'blk').toString('pem', 'private_pkcs1');
    await setItem(this.keyID, pem);
    return this.keyPair;
  }

  async createSigner() {
    if (!this.privateKey) {
      throw error;
    } else {
      const hex = fromPemToHex(this.privateKey);
      return ES256KSigner(hex);
    }
  }

  async sign(payload: any, did: string) {
    if (!this.privateKey) {
      throw error;
    }
    const signer = await this.createSigner();
    return await createJWS(payload, signer, {
      alg: 'ES256K',
      typ: 'JWT',
      kid: did + '#controller',
    });
  }

  async getMinimalJwk() {
    if (!this.privateKey) {
      throw error;
    }
    return generateJwkFromPrivateKeyPEM(this.privateKey);
  }
}

export default ECKey;
