import {PersonaWithECKey, PersonaWithoutKey} from '../src/persona';
import {ec as EC} from 'elliptic';
import {ES256KSigner} from 'did-jwt';
import {ECKeyPair} from '../src/keys/ec';

const ec = new EC('secp256k1');

describe('persona', () => {
  const privateKeyHex =
    '9702a6dd71bda7f7fdbf524b9c5dcdb8ba6aabd9df629373b0e31b46d68f6710';
  const key = ec.keyFromPrivate(privateKeyHex);
  const persona = new PersonaWithECKey('did:example:ab', new ECKeyPair(key));

  test('sign', async () => {
    const expected =
      'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QiLCJraWQiOiJkaWQ6ZXhhbXBsZTphYiNjb250cm9sbGVyIn0.eyJzYW1wbGUiOiJkYXRhIn0.52KfBvotjTPvbZl0Ez_pL__X_9Dqkv_zbn0lBGhnlQZQ_JGQcYbpQhSG_T0g07-NXrLd6lMld8hp2-n1HtKP3A';
    await expect(persona.sign({sample: 'data'})).resolves.toBe(expected);
  });

  test('getMinimalJWK', async () => {
    const expected = {
      kty: 'EC',
      crv: 'P-256K',
      x: 'rT61nvuz2LCRzx4W1EfEwGAiVgCuN6aKTW-PZ46qD1E',
      y: 'ABGl1Pr6v7nVwvaa1g14m5M7oGgqs23Fpf780x-VJpM',
    };
    expect(persona.getMinimalJWK()).toStrictEqual(expected);
  });

  test('getSubjectIdentifier()', async () => {
    const expected = 'dN-6gi0j9CipfcFlPYP76f7ypK-l3_svrVRc3IKjImA';
    expect(persona.getSubjectIdentifier()).toBe(expected);
  });
});

describe('PersonaWithoutKey', () => {
  const privateKeyHex =
    '9702a6dd71bda7f7fdbf524b9c5dcdb8ba6aabd9df629373b0e31b46d68f6710';

  const persona = new PersonaWithoutKey(
    'did:example:ab',
    'did:example:ab#controller',
    ES256KSigner(privateKeyHex) as (
      data: string | Uint8Array,
    ) => Promise<string>,
    'ES256K',
    {
      kty: 'EC',
      crv: 'P-256K',
      x: 'rT61nvuz2LCRzx4W1EfEwGAiVgCuN6aKTW-PZ46qD1E',
      y: 'ABGl1Pr6v7nVwvaa1g14m5M7oGgqs23Fpf780x-VJpM',
    },
  );

  test('getSubjectIdentifier()', () => {
    expect(persona.getSubjectIdentifier()).toBe(
      'dN-6gi0j9CipfcFlPYP76f7ypK-l3_svrVRc3IKjImA',
    );
  });

  test('sign()', async () => {
    const expected =
      'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QiLCJraWQiOiJkaWQ6ZXhhbXBsZTphYiNjb250cm9sbGVyIn0.eyJzYW1wbGUiOiJkYXRhIn0.52KfBvotjTPvbZl0Ez_pL__X_9Dqkv_zbn0lBGhnlQZQ_JGQcYbpQhSG_T0g07-NXrLd6lMld8hp2-n1HtKP3A';
    await expect(persona.sign({sample: 'data'})).resolves.toBe(expected);
  });
});
