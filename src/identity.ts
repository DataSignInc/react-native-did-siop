import ECKey from './keys/ec';
import {calculateJWKThumprint} from './jwt';

class Identity {
  public did: string;
  private key: ECKey;
  private authenticate: any;

  constructor(did: string, key: ECKey, authenticate: any) {
    this.did = did;
    this.key = key;
    this.authenticate = authenticate;
  }

  async sign(data: any) {
    return await this.key.sign(data, this.did);
  }

  async authenticateMe() {
    return await this.authenticate();
  }

  async generateSubjectJwk() {
    return await this.key.getMinimalJwk();
  }
  async generateSubject() {
    const jwk = await this.generateSubjectJwk();
    return calculateJWKThumprint(jwk);
  }
}

export default Identity;
