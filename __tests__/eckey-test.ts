import {ec as EC} from 'elliptic';
import {ECKeyPair} from '../src/keys/ec';

// Create and initialize EC context
// (better do it once and reuse it)
const ec = new EC('secp256k1');

// Generate keys
const key = ec.genKeyPair();

describe('key/ec', () => {
  const keyPair = new ECKeyPair(key);

  test('sign', async () => {
    await keyPair.sign({}, 'test');
  });

  test('getJWK', () => {
    keyPair.getJWK();
  });
});
