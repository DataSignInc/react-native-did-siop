import {calculateJWKThumbprint} from './jwt';

class Persona {
  public did: string;
  private keyPair: any;

  constructor(did: string, keyPair: any) {
    this.did = did;
    this.keyPair = keyPair;
  }

  getMinimalJWK() {
    return this.keyPair.getJWK();
  }

  getSubjectIdentier() {
    const jwk = this.getMinimalJWK();
    return calculateJWKThumbprint(jwk);
  }

  async sign(payload: any) {
    return this.keyPair.sign(payload, this.did);
  }
}

export default Persona;
