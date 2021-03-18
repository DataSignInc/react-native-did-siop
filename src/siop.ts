import Identity from './identity';
import ECKey from './keys/ec';
import {debug} from './log';
import {SIOPValidator} from './sioputils';
import {Request, RequestObject, IDToken} from './siop-schema';

export class Provider {
  private identity: Identity;
  private expiresIn: number;
  constructor(did: string, privateKeyID: string) {
    this.identity = new Identity(did, new ECKey(privateKeyID));
    this.expiresIn = 3600;
  }
  // async handle(url: string) {
  //   console.log('SIOP Request received...');
  //   const {params, request} = await this.receiveSIOPRequest(url);
  //   console.log('Generating SIOP Response...');
  //   return this.generateSIOPResponse(request);
  // }

  async handleParams(params: Request) {
    try {
      debug(params);
      const {request, requestObject} = await this.parse(params);
      await this.identity.authenticateMe();
      return this.generateSIOPResponse(requestObject);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async parse(params: any) {
    try {
      const validator = new SIOPValidator();
      return await validator.validateSIOPRequest(params, this.identity.did);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  // async receiveSIOPRequest(url: string) {
  //   const parser = new URLParser(url);
  //   const {params, request} = await parser.parse();
  //   const key = new Key(request.header);
  //   const validator = new RequestValidator(key);
  //   validator.validate(params, request.payload);

  //   return {
  //     params: params as Request,
  //     request: request.payload as RequestObject,
  //   };
  // }

  getRequestObject(params: any) {
    if (params.request) {
      return params.request;
    } else if (params.request_uri) {
      return {};
    }
  }

  async generateIDToken(request: RequestObject) {
    const issuedAt = Math.floor(Date.now() / 1000);
    const idToken: IDToken = {
      iss: 'https://self-issued.me',
      sub: await this.identity.generateSubject(),
      did: this.identity.did,
      aud: request.client_id,
      iat: issuedAt,
      exp: issuedAt + this.expiresIn,
      nonce: request.nonce,
      sub_jwk: await this.identity.generateSubjectJwk(),
    };
    debug(idToken);

    const jws = await this.identity.sign(idToken);
    return jws;
  }

  async generateSIOPResponse(request: RequestObject) {
    const idToken = await this.generateIDToken(request);
    // No Access Token is returned for accessing a UserInfo Endpoint, so all Claims returned MUST be in the ID Token.
    // refer: https://bitbucket.org/openid/connect/src/master/openid-connect-self-issued-v2-1_0.md
    // Is `state` not needed neither?
    const location = `${request.client_id}#id_token=${idToken}`;
    debug(location);
    return location;
  }
}
