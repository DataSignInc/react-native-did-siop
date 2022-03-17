import {PersonaWithoutKey} from '../src/persona';
import {ec as EC} from 'elliptic';

import {EdDSASigner, ES256KSigner} from 'did-jwt';
import {getMinimalJWK} from '../src/joseutils/jwk';

const ec = new EC('secp256k1');

describe('secp256k1 PersonaWithoutKey', () => {
  const privateKeyHex =
    '9702a6dd71bda7f7fdbf524b9c5dcdb8ba6aabd9df629373b0e31b46d68f6710';
  const key = ec.keyFromPrivate(privateKeyHex);
  const persona = new PersonaWithoutKey(
    'did:example:ab',
    'did:example:ab#controller',
    ES256KSigner(privateKeyHex),
    'ES256K',
    getMinimalJWK(key.getPublic()),
  );

  test('sign', async () => {
    const expected =
      'eyJhbGciOiJFUzI1NksiLCJraWQiOiJkaWQ6ZXhhbXBsZTphYiNjb250cm9sbGVyIiwidHlwIjoiSldUIn0.eyJzYW1wbGUiOiJkYXRhIn0.8OQo-3CMWOqrZY8eFPk9j-IlJzo7tLnUk8lwVnMs0O_s6Y_NcBSv1R2mvK0-1NnhiHZPzLLtcN1lGOQRvdI1Eg';
    await expect(persona.sign({sample: 'data'})).resolves.toBe(expected);
  });

  test('getMinimalJWK', async () => {
    const expected = {
      kty: 'EC',
      crv: 'secp256k1',
      x: 'rT61nvuz2LCRzx4W1EfEwGAiVgCuN6aKTW-PZ46qD1E',
      y: 'ABGl1Pr6v7nVwvaa1g14m5M7oGgqs23Fpf780x-VJpM',
    };
    expect(persona.getMinimalJWK()).toStrictEqual(expected);
  });

  test('getSubjectIdentifier()', async () => {
    const expected = 'qXDc9pJnMIAOhF0ThPldiuR4v-yjB_l7JQVcME1x8VI';
    expect(persona.getSubjectIdentifier()).toBe(expected);
  });
});

describe('Ed25519 PersonaWithoutKey', () => {
  const privateKeyHex =
    '9eV2fPFTMZUXYw8iaHa4bIFgzFg7wBN0TGvyVfXMDuUngRf8FExyNA9n0PIxboOGzv+/KyQoycUf73xZfx1Cbg==';

  const persona = new PersonaWithoutKey(
    'did:example:ab',
    'did:example:ab#controller',
    EdDSASigner(privateKeyHex) as (
      data: string | Uint8Array,
    ) => Promise<string>,
    'EdDSA',
    // https://datatracker.ietf.org/doc/html/rfc8037
    {
      kty: 'OKP',
      crv: 'Ed25519',
      // base64url-encoded public key.
      x: 'THP2m9FHt3YXeQTSNeJBtJq3HVL7E9L7-pmuSJCqMkg',
    },
  );

  test('getSubjectIdentifier()', () => {
    expect(persona.getSubjectIdentifier()).toBe(
      'kHXAhmYGbPv38WZnzsaw9nKmS6PS_JG3eIokgGUK_FY',
    );
  });

  test('sign()', async () => {
    const expected =
      'eyJhbGciOiJFZERTQSIsImtpZCI6ImRpZDpleGFtcGxlOmFiI2NvbnRyb2xsZXIiLCJ0eXAiOiJKV1QifQ.eyJzYW1wbGUiOiJkYXRhIn0.s9IofF2fV8V_guP3SJ8Cllr9aiQXWTzAj1Z4dBz1kBBrcJlXWxOR6jdB7lLAy-WAQVY-zM89X3lLOsbLwP1WBQ';
    await expect(persona.sign({sample: 'data'})).resolves.toBe(expected);
  });
});
