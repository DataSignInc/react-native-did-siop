import {calculateJWKThumprint} from './jwt';

class Persona {
  public did: string;
  private keyPairID: string;
  private keyPair: any;
  private doUnlockKeyPair: () => Promise<any>;

  constructor(
    did: string,
    keyPairID: string,
    doUnlockKeyPair: () => Promise<any>,
  ) {
    this.did = did;
    this.keyPairID = keyPairID;
    this.keyPair = null;
    this.doUnlockKeyPair = doUnlockKeyPair;
  }

  async unlockKeyPair() {
    this.keyPair = await this.doUnlockKeyPair();
  }

  getMinimalJWK() {
    return this.keyPair.getJWK();
  }

  getSubjectIdentier() {
    const jwk = this.getMinimalJWK();
    return calculateJWKThumprint(jwk);
  }

  async sign(payload: any) {
    return this.keyPair.sign(payload, this.did);
  }
}

export default Persona;
