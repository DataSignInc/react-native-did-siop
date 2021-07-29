import {ECKeyPair} from '../src/keys/ec';
import {ec as EC} from 'elliptic';

const ec = new EC('secp256k1');

describe('key/ec', () => {
  const sekp256k1Key = ec.keyFromPrivate(
    '9702a6dd71bda7f7fdbf524b9c5dcdb8ba6aabd9df629373b0e31b46d68f6710',
  );
  const keyPair = new ECKeyPair(sekp256k1Key);

  test('sign', async () => {
    const expected =
      'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QiLCJraWQiOiJkaWQ6ZXhhbXBsZTphYiNjb250cm9sbGVyIn0.eyJzYW1wbGUiOiJkYXRhIn0.52KfBvotjTPvbZl0Ez_pL__X_9Dqkv_zbn0lBGhnlQZQ_JGQcYbpQhSG_T0g07-NXrLd6lMld8hp2-n1HtKP3A';
    await expect(
      keyPair.sign({sample: 'data'}, 'did:example:ab'),
    ).resolves.toBe(expected);
  });

  test('getJWK', () => {
    const expected = {
      kty: 'EC',
      crv: 'K-256',
      x: 'rT61nvuz2LCRzx4W1EfEwGAiVgCuN6aKTW-PZ46qD1E',
      y: 'ABGl1Pr6v7nVwvaa1g14m5M7oGgqs23Fpf780x-VJpM',
    };
    expect(keyPair.getJWK()).toStrictEqual(expected);
  });
});
