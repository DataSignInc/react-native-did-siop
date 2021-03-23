import {debug} from './log';
import {SIOPValidator} from './sioputils';
import {Request, RequestObject, IDToken} from './siop-schema';
import {SIOPRequestValidationError, SIOPResponseGenerationError} from './error';
import Persona from './persona';

export class Provider {
  private expiresIn: number;
  private requestObject: any;
  public choosePersona: () => Promise<Persona>; // rp => (did, keypairid)
  constructor(choosePersona: any, authenticatePersona: any) {
    this.choosePersona = async () => {
      const [did, keyPairID] = await choosePersona();
      return new Persona(did, keyPairID, authenticatePersona);
    };
    this.expiresIn = 3600;
  }

  async receiveRequestParameters(params: any) {
    try {
      const validator = new SIOPValidator();
      const {request, requestObject} = await validator.validateSIOPRequest(
        params,
      );
      this.requestObject = requestObject;
      return requestObject.client_id;
    } catch (error) {
      console.error(error);
      throw new SIOPRequestValidationError(error);
    }
  }

  async authenticatePersona(persona: Persona) {
    if (!persona) {
      throw Error('persona is not choosed or not found');
    }
    return persona.unlockKeyPair();
  }

  private getRequestObject(params: any) {
    if (params.request) {
      return params.request;
    } else if (params.request_uri) {
      return {};
    }
  }

  private async generateIDToken(request: RequestObject, persona: Persona) {
    const issuedAt = Math.floor(Date.now() / 1000);
    const idToken: IDToken = {
      iss: 'https://self-issued.me',
      sub: persona.getSubjectIdentier(),
      did: persona.did,
      aud: request.client_id,
      iat: issuedAt,
      exp: issuedAt + this.expiresIn,
      nonce: request.nonce,
      sub_jwk: persona.getMinimalJWK(),
    };
    debug(idToken);

    const jws = await persona.sign(idToken);
    return jws;
  }

  async generateResponse(persona: Persona) {
    try {
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
