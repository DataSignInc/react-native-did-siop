import { Resolver } from 'did-resolver';
export interface JWTHeader {
    typ: string;
    alg: string;
    kid: string;
}
export declare const verifyJWT: (jwt: string, resolver: Resolver) => Promise<void>;
export declare const calculateJWKThumprint: (jwk: {}) => string;
