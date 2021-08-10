import { RequestObject } from './siop-schema';
import Persona from './persona';
import { ec as EC } from 'elliptic';
import { Resolver } from 'did-resolver';
export default class Provider {
    private expiresIn;
    private requestObject;
    private resolver;
    constructor(expiresIn: number, resolver: Resolver);
    receiveRequest(paramsOrUrl: object | string): Promise<string>;
    private _receiveRequest;
    generateIDToken(request: RequestObject, persona: Persona, vp?: any): Promise<any>;
    generateResponse(did: string, keyPair: EC.KeyPair, vp?: any): Promise<string>;
}
