import ECKey from './keys/ec';
import {calculateJWKThumprint} from './jwt';

class Identity {
  public did: string;
  private key: ECKey;

  constructor(did: string, key: ECKey) {
    this.did = did;
    this.key = key;
  }

  async sign(data: any) {
    return await this.key.sign(data, this.did);
  }

  async authenticateMe() {
    return await this.key.authenticateKeyOwner();
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
