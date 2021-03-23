import {Provider} from './siop';
import ECKey, {generateKeyPair as generateECKeyPair} from './keys/ec';

export default Provider;

export {ECKey, generateECKeyPair};

export type {SigningAlgorithm, DIDMethodPrefix, ErrorCode} from './siop-schema';
