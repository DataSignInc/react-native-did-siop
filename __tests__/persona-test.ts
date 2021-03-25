import Persona from '../src/persona';
import {ec as EC} from 'elliptic';
import {ECKeyPair} from '../src/keys/ec';

const ec = new EC('secp256k1');

describe('persona', () => {
  const key = ec.genKeyPair();
  const unlock = async () => new ECKeyPair(key);
  const persona = new Persona('did:example:ab', 'key-pair-id', unlock);

  test('sign', async () => {
    persona.unlockKeyPair();
    persona.sign({});
  });
  test('getMinimalJWK', () => {
    persona.unlockKeyPair();
    persona.getMinimalJWK();
  });

  test('getSubjectIdnetier()', () => {
    persona.unlockKeyPair();
    persona.getSubjectIdentier();
  });
});
