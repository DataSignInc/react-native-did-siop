class Persona {
  private did: string;
  private keyPairID: string;
  private keyPair: any;
  private doUnlockKeyPair: () => any;

  constructor(did: string, keyPairID: string, doUnlockKeyPair: () => any) {
    this.did = did;
    this.keyPairID = keyPairID;
    this.keyPair = null;
    this.doUnlockKeyPair = doUnlockKeyPair;
  }

  unlockKeyPair() {
    this.keyPair = this.doUnlockKeyPair();
  }

  getMinimalJWK() {
    return '';
  }

  sign() {}
}

export default Persona;
