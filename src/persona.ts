class Persona {
  public did: string;
  private keyPairID: string;
  private keyPair: any;
  private doUnlockKeyPair: () => Promise<any>;

  constructor(
    did: string,
    keyPairID: string,
    doUnlockKeyPair: () => Promise<any>,
  ) {
    this.did = did;
    this.keyPairID = keyPairID;
    this.keyPair = null;
    this.doUnlockKeyPair = doUnlockKeyPair;
  }

  async unlockKeyPair() {
    this.keyPair = await this.doUnlockKeyPair();
  }

  async getMinimalJWK() {
    return '';
  }

  async getSubjectIdentier() {}

  async sign(payload: any) {}
}

export default Persona;
