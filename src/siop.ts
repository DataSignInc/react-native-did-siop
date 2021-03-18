import {debug} from './log';
import {SIOPValidator} from './sioputils';
import {Request, RequestObject, IDToken} from './siop-schema';
import {SIOPRequestValidationError, SIOPResponseGenerationError} from './error';
import Persona from './persona';

export class Provider {
  private persona: Persona;
  private expiresIn: number;
  private requestObject: any;
  private choosePersona: any; // rp => (did, keypairid)
  private doPersonaAuthentication: any; // (did, keypairid) => Promise<keypair>
  constructor(did: string, privateKeyID: string, doPersonaAuthentication: any) {
    this.persona = new Persona(did, privateKeyID, doPersonaAuthentication);
    this.expiresIn = 3600;
  }

  async handleParams(params: Request) {
    try {
      debug(params);
      await this.receiveRequestParameters(params);
      await this.authenticatePersona();
      return this.generateResponse(this.persona);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async receiveRequestParameters(params: any) {
    try {
      const validator = new SIOPValidator();
      const {request, requestObject} = await validator.validateSIOPRequest(
        params,
        this.persona.did,
      );
      this.requestObject = requestObject;
    } catch (error) {
      console.error(error);
      throw new SIOPRequestValidationError(error);
    }
  }

  async authenticatePersona() {
    return this.persona.unlockKeyPair();
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

  // async handle(url: string) {
  //   console.log('SIOP Request received...');
  //   const {params, request} = await this.receiveSIOPRequest(url);
  //   console.log('Generating SIOP Response...');
  //   return this.generateSIOPResponse(request);
  // }

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
