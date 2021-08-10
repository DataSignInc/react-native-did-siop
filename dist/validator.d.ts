import { JWTHeader } from 'did-jwt';
import { Resolver } from 'did-resolver';
import { Registration, Request, RequestObject } from './siop-schema';
export default class SIOPValidator {
    private resolver;
    constructor(resolver: Resolver);
    validateSIOPRequest(request: any): Promise<{
        request: Request;
        requestObject: RequestObject;
    }>;
    validateSignature(jwt: string): Promise<import("did-jwt/lib/JWT").JWTDecoded>;
    validateDIDAuthnParameters(request: RequestObject, registration: Registration, jwtHeader: JWTHeader): void;
    validateOIDCQueryParameters(params: any): Promise<void>;
    validateRequestObject(requestObject: any, params: any, registration: Registration): Promise<void>;
    validateClientId(request: Request, requestObject: RequestObject, registration?: Registration): void;
    validateResponseType(response_type: string): void;
    validateIss(iss?: string, registration?: Registration): void;
    validateScope(scope?: string): void;
    validateKid(kid?: string, registraion?: Registration, jwks?: any): void;
}
