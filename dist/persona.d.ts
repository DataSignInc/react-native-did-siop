declare class Persona {
    did: string;
    private keyPair;
    constructor(did: string, keyPair: any);
    getMinimalJWK(): any;
    getSubjectIdentier(): string;
    sign(payload: any): Promise<any>;
}
export default Persona;
