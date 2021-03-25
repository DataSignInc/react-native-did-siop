import {ec as EC} from 'elliptic';
import {ECKeyPair} from '../src/keys/ec';

const ec = new EC('secp256k1');

describe('key/ec', () => {
  const privateKeyHex =
    '9702a6dd71bda7f7fdbf524b9c5dcdb8ba6aabd9df629373b0e31b46d68f6710';
  const key = ec.keyFromPrivate(privateKeyHex);
  const keyPair = new ECKeyPair(key);

  test('sign', async () => {
    const expected =
      'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QiLCJraWQiOiJ0ZXN0I2NvbnRyb2xsZXIifQ.eyJzYW1wbGUiOiJkYXRhIn0.yDpf0X9WBvhBohQi-7mkMv7FdfzL1NQt4WuGTLUurr9hvBEZ8-AirHbFhafhtoAT9CGdlRum12zAlwGGoPSXIg';
    await expect(keyPair.sign({sample: 'data'}, 'test')).resolves.toBe(
      expected,
    );
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
