var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import base64url from 'base64url';
import Base64 from 'crypto-js/enc-base64';
import sha256 from 'crypto-js/sha256';
import * as didJWT from 'did-jwt';
export const verifyJWT = (jwt, resolver) => __awaiter(void 0, void 0, void 0, function* () {
    yield didJWT.verifyJWT(jwt, {
        resolver,
    });
});
export const calculateJWKThumprint = (jwk) => {
    const base64Thumbprint = sha256(JSON.stringify(jwk)).toString(Base64);
    return base64url.fromBase64(base64Thumbprint);
};
