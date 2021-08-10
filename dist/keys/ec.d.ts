import { ec as EC } from 'elliptic';
export declare class ECKeyPair {
    private keyPair;
    constructor(keyPair: EC.KeyPair);
    sign(payload: any, did: string): Promise<string>;
    getJWK(): any;
}
