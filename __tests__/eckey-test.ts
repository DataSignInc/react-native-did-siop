import {ec as EC} from 'elliptic';
import {ECKeyPair} from '../src/keys/ec';

// Create and initialize EC context
// (better do it once and reuse it)
var ec = new EC('secp256k1');

// Generate keys
var key = ec.genKeyPair();

const privateKey = key.getPrivate();

describe('key/ec', () => {
  const keyPair = new ECKeyPair(key);

  test('sign', async () => {
    await keyPair.sign({}, 'test');
  });

  test('getJWK', () => {
    keyPair.getJWK();
  });
});
