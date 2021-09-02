import SIOPValidator from './validator';
import {RequestObject, IDToken} from './siop-schema';
import {
  SIOPError,
  SIOPRequestValidationError,
  SIOPResponseGenerationError,
} from './error';
import Persona from './persona';
import {getIssuedAt, parseSIOPRequestUri} from './sioputils';
import {ECKeyPair} from './keys/ec';
import {ec as EC} from 'elliptic';
import {Resolver} from 'did-resolver';
export default class Provider {
  private expiresIn: number;
  private requestObject: any;
  private resolver: Resolver;
  private clientId?: string;
  private state?: string;

  constructor(expiresIn: number, resolver: Resolver) {
    this.expiresIn = expiresIn;
    this.resolver = resolver;
  }

  receiveRequest(paramsOrUrl: object | string) {
    try {
      return this._receiveRequest(paramsOrUrl);
    } catch (error) {
      if (error instanceof SIOPError) {
        throw error;
      } else {
        throw new SIOPRequestValidationError(error, this.clientId, this.state);
      }
    }
  }

  private async _receiveRequest(paramsOrUrl: object | string) {
    let params =
      typeof paramsOrUrl === 'string'
        ? parseSIOPRequestUri(paramsOrUrl)
        : paramsOrUrl;

    // @ts-expect-error ts(2339)
    this.clientId = params.clientId;
    // @ts-expect-error ts(2339)
    this.state = params.state;

    const validator = new SIOPValidator(
      this.resolver,
      this.clientId,
      this.state,
    );
    const {requestObject} = await validator.validateSIOPRequest(params);
    this.requestObject = requestObject;
    return requestObject.client_id;
  }
  public async generateIDToken(
    request: RequestObject,
    persona: Persona,
    vp?: any,
  ) {
    const issuedAt = getIssuedAt();
    const idToken: IDToken = {
      iss: 'https://self-issued.me',
      sub: persona.getSubjectIdentier(),
      did: persona.did,
      aud: request.client_id,
      iat: issuedAt,
      exp: issuedAt + this.expiresIn,
      nonce: request.nonce,
      state: request.state,
      vp: vp,
      sub_jwk: persona.getMinimalJWK(),
    };

    const jws = await persona.sign(idToken);
    return jws;
  }

  async generateResponse(did: string, keyPair: EC.KeyPair, vp?: any) {
    try {
      const persona = new Persona(did, new ECKeyPair(keyPair));
      const request: RequestObject = this.requestObject;
      const idToken = await this.generateIDToken(request, persona, vp);
      // No Access Token is returned for accessing a UserInfo Endpoint, so all Claims returned MUST be in the ID Token.
      // refer: https://bitbucket.org/openid/connect/src/master/openid-connect-self-issued-v2-1_0.md
      // Is `state` not needed neither?
      const location = `${request.client_id}#id_token=${idToken}`;
      return location;
    } catch (error) {
      throw new SIOPResponseGenerationError(error, this.clientId, this.state);
    }
  }
}
