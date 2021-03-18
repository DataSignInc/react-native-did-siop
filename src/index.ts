import {Provider} from './siop';
import {saveECKey} from './keys/ec';
import {sign} from './keys/rsa';
import ECKey from './keys/ec';

export default Provider;

export {saveECKey, sign, ECKey};

export type {SigningAlgorithm, DIDMethodPrefix, ErrorCode} from './siop-schema';
