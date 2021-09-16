import {calculateJWKThumbprint} from './jwt';
import {createJWS} from 'did-jwt';

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
  private signFunction: (data: string | Uint8Array) => Promise<string>;
  private signAlgorithm: string;
  private minimalJwk: any;
  private kid: string;

  /**
   *  Create a Persona instance without actual value of secret keys.
   *
   *  @param    {string}            did            did
   *  @param    {string}            kid            kid which will be included in minimal jwk's and JWT headers
   *  @param    {(data: string | Uint8Array) => Promise<string>} sign a function to sign data
   *  @param    {string}            signAlgorithm                     algorithm used by the sign function. Included in JWT headers
   *  @param    {any}               minimalJwk                        minimalJwk which will be included in id tokens as `sub_jwk` claim
   */
  constructor(
    did: string,
    kid: string,
    sign: (data: string | Uint8Array) => Promise<string>,
    signAlgorithm: string,
    minimalJwk: any,
  ) {
    super(did);
    this.kid = kid;
    this.signFunction = sign;
    this.signAlgorithm = signAlgorithm;
    this.minimalJwk = minimalJwk;
  }

  getMinimalJWK() {
    return this.minimalJwk;
  }

  async sign(payload: any) {
    return await createJWS(payload, this.signFunction, {
      alg: this.signAlgorithm,
      typ: 'JWT',
      kid: this.kid,
    });
  }
}

export default Persona;
