import Identity from './identity';
import ECKey from './keys/ec';
import {debug} from './log';
import {SIOPValidator} from './sioputils';
import {Request, RequestObject, IDToken} from './siop-schema';
import {SIOPRequestValidationError, SIOPResponseGenerationError} from './error';

export class Provider {
  private identity: Identity;
  private expiresIn: number;
  private requestObject: any;
  private choosePersona: any; // rp => (did, keypairid)
  private doPersonaAuthentication: any; // (did, keypairid) => Promise<keypair>
  constructor(did: string, privateKeyID: string) {
    const keyPair = new ECKey(privateKeyID);
    this.identity = new Identity(did, keyPair, keyPair.authenticateKeyOwner);
    this.expiresIn = 3600;
  }

  async handleParams(params: Request) {
    try {
      debug(params);
      await this.receiveRequestParameters(params);
      await this.authenticatePersona();
      return this.generateResponse(this.identity);
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
        this.identity.did,
      );
      this.requestObject = requestObject;
    } catch (error) {
      console.error(error);
      throw new SIOPRequestValidationError(error);
    }
  }

  async authenticatePersona() {
    return this.identity.authenticateMe();
  }

  private getRequestObject(params: any) {
    if (params.request) {
      return params.request;
    } else if (params.request_uri) {
      return {};
    }
  }

  private async generateIDToken(request: RequestObject, identity: Identity) {
    const issuedAt = Math.floor(Date.now() / 1000);
    const idToken: IDToken = {
      iss: 'https://self-issued.me',
      sub: await identity.generateSubject(),
      did: this.identity.did,
      aud: request.client_id,
      iat: issuedAt,
      exp: issuedAt + this.expiresIn,
      nonce: request.nonce,
      sub_jwk: await identity.generateSubjectJwk(),
    };
    debug(idToken);

    const jws = await identity.sign(idToken);
    return jws;
  }

  async generateResponse(identity: Identity) {
    try {
      const request: RequestObject = this.requestObject;
      const idToken = await this.generateIDToken(request, identity);
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
