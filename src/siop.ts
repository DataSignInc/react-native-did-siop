import {debug} from './log';
import SIOPValidator from './validator';
import {Request, RequestObject, IDToken} from './siop-schema';
import {SIOPRequestValidationError, SIOPResponseGenerationError} from './error';
import Persona from './persona';
import {getIssuedAt} from './sioputils';
import {ECKeyPair} from './keys/ec';
import {ec as EC} from 'elliptic';

export class Provider {
  private expiresIn: number;
  private requestObject: any;
  constructor(expiresIn: number) {
    this.expiresIn = expiresIn;
  }

  async receiveRequestParameters(params: any) {
    const validator = new SIOPValidator();
    const {request, requestObject} = await validator.validateSIOPRequest(
      params,
    );
    this.requestObject = requestObject;
    return requestObject.client_id;
  }
  public async generateIDToken(request: RequestObject, persona: Persona) {
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
      sub_jwk: persona.getMinimalJWK(),
    };
    debug(idToken);

    const jws = await persona.sign(idToken);
    return jws;
  }

  async generateResponse(did: string, keyPair: EC.KeyPair) {
    try {
      const persona = new Persona(did, new ECKeyPair(keyPair));
      const request: RequestObject = this.requestObject;
      const idToken = await this.generateIDToken(request, persona);
      // No Access Token is returned for accessing a UserInfo Endpoint, so all Claims returned MUST be in the ID Token.
      // refer: https://bitbucket.org/openid/connect/src/master/openid-connect-self-issued-v2-1_0.md
      // Is `state` not needed neither?
      const location = `${request.client_id}#id_token=${idToken}`;
      debug(location);
      return location;
    } catch (error) {
      throw new SIOPResponseGenerationError(error);
    }
  }

  async receiveRequest(url: string) {
    throw 'Not Implemented';
    // const parser = new URLParser(url);
    // const {params, request} = await parser.parse();
    // const key = new Key(request.header);
    // const validator = new RequestValidator(key);
    // validator.validate(params, request.payload);

    // return {
    //   params: params as Request,
    //   request: request.payload as RequestObject,
    // };
  }
}
