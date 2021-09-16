import {calculateJWKThumbprint} from './jwt';

abstract class Persona {
  public did: string;

  constructor(did: string) {
    this.did = did;
  }
  abstract getMinimalJWK(): any;
  getSubjectIdentifier() {
    const jwk = this.getMinimalJWK();
    return calculateJWKThumbprint(jwk);
  }
  abstract sign(payload: any): any;
}

export class PersonaWithECKey extends Persona {
  private keyPair: any;

  constructor(did: string, keyPair: any) {
    super(did);
    this.keyPair = keyPair;
  }

  getMinimalJWK() {
    return this.keyPair.getJWK();
  }

  async sign(payload: any) {
    return this.keyPair.sign(payload, this.did);
  }
}

export class PersonaWithoutKey extends Persona {
  private signFunction: (payload: string) => string;
  private minimalJwk: any;

  constructor(did: string, sign: any, minimalJwk: any) {
    super(did);
    this.signFunction = sign;
    this.minimalJwk = minimalJwk;
  }

  getMinimalJWK() {
    return this.minimalJwk;
  }

  async sign(payload: any) {
    return this.signFunction(payload);
  }
}

export default Persona;
