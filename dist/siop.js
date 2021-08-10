var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import SIOPValidator from './validator';
import { SIOPError, SIOPRequestValidationError, SIOPResponseGenerationError, } from './error';
import Persona from './persona';
import { getIssuedAt, parseSIOPRequestUri } from './sioputils';
import { ECKeyPair } from './keys/ec';
export default class Provider {
    constructor(expiresIn, resolver) {
        this.expiresIn = expiresIn;
        this.resolver = resolver;
    }
    receiveRequest(paramsOrUrl) {
        try {
            return this._receiveRequest(paramsOrUrl);
        }
        catch (error) {
            if (error instanceof SIOPError) {
                throw error;
            }
            else {
                throw new SIOPRequestValidationError(error);
            }
        }
    }
    _receiveRequest(paramsOrUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            let params = typeof paramsOrUrl === 'string'
                ? parseSIOPRequestUri(paramsOrUrl)
                : paramsOrUrl;
            const validator = new SIOPValidator(this.resolver);
            const { requestObject } = yield validator.validateSIOPRequest(params);
            this.requestObject = requestObject;
            return requestObject.client_id;
        });
    }
    generateIDToken(request, persona, vp) {
        return __awaiter(this, void 0, void 0, function* () {
            const issuedAt = getIssuedAt();
            const idToken = {
                iss: 'https://self-issued.me',
                sub: persona.getSubjectIdentier(),
                did: persona.did,
                aud: request.client_id,
                iat: issuedAt,
                exp: issuedAt + this.expiresIn,
                nonce: request.nonce,
                state: request.state,
                vp: vp,
                sub_jwk: persona.getMinimalJWK(),
            };
            const jws = yield persona.sign(idToken);
            return jws;
        });
    }
    generateResponse(did, keyPair, vp) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const persona = new Persona(did, new ECKeyPair(keyPair));
                const request = this.requestObject;
                const idToken = yield this.generateIDToken(request, persona, vp);
                // No Access Token is returned for accessing a UserInfo Endpoint, so all Claims returned MUST be in the ID Token.
                // refer: https://bitbucket.org/openid/connect/src/master/openid-connect-self-issued-v2-1_0.md
                // Is `state` not needed neither?
                const location = `${request.client_id}#id_token=${idToken}`;
                return location;
            }
            catch (error) {
                throw new SIOPResponseGenerationError(error);
            }
        });
    }
}
