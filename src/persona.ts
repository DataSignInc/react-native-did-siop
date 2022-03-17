import {calculateJWKThumbprint} from './jwt';
import {createJWS, Signer} from 'did-jwt';
import {deriveMinimalJwk, MinimalJwk} from './jwk';

type Signable = Parameters<typeof createJWS>[0];

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
  abstract sign(payload: Signable): Promise<string>;
}

export class PersonaWithoutKey extends Persona {
  private signFunction: Signer;
  private signAlgorithm: string;
  private minimalJwk: any;
  private kid: string;

  /**
   *  Create a Persona instance without actual value of secret keys.
   *
   *  @param    {string}            did            did
   *  @param    {string}            kid            kid which will be included in minimal jwk's and JWT headers
   *  @param    {Signer}            sign           a function to sign data. Passed to createJWS() of the did-jwt package.
   *  @param    {string}            alg  algorithm used by the sign function. Included in JWT headers
   *  @param    {any}               minimalJwk     minimalJwk which will be included in id tokens as `sub_jwk` claim
   */
  constructor(
    did: string,
    kid: string,
    sign: Signer,
    alg: 'ES256K' | 'EdDSA',
    publicKey: Uint8Array | MinimalJwk,
  ) {
    super(did);
    this.kid = kid;
    this.signFunction = sign;
    this.signAlgorithm = alg;
    this.minimalJwk =
      'kty' in publicKey ? publicKey : deriveMinimalJwk(publicKey, alg);
  }

  getMinimalJWK() {
    return this.minimalJwk;
  }

  async sign(payload: Signable) {
    return await createJWS(
      payload,
      this.signFunction,
      {
        alg: this.signAlgorithm,
        typ: 'JWT',
        kid: this.kid,
      },
      {canonicalize: true},
    );
  }
}

export default Persona;
