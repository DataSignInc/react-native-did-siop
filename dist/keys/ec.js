var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Elliptic Curve （楕円曲線） Digital Signature Algorithm
import keyto from '@trust/keyto';
import { createJWS, ES256KSigner } from 'did-jwt';
// const curve = 'secp256k1';
// const ec = new EC(curve);
export class ECKeyPair {
    constructor(keyPair) {
        this.keyPair = keyPair;
    }
    sign(payload, did) {
        return __awaiter(this, void 0, void 0, function* () {
            const privateKey = this.keyPair.getPrivate();
            const signer = ES256KSigner(privateKey.toString('hex'));
            return yield createJWS(payload, signer, {
                alg: 'ES256K',
                typ: 'JWT',
                kid: did + '#controller',
            });
        });
    }
    getJWK() {
        const publicKey = this.keyPair.getPublic('hex');
        const a = keyto.from(publicKey, 'blk').toJwk('public');
        return a;
    }
}
const error = 'not authenticated';
