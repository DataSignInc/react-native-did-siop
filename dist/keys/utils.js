import keyto from '@trust/keyto';
// const testKeyto = (pemPrivate: string) => {
//   // let pemPrivate = getPrivatePemStringSomehow();
//   // let jwk = getPublicJwkSomehow();
//   // String data can either be passed in directly:
//   let key = keyto.from(pemPrivate, 'pem').toString('blk', 'private');
//   return key;
//   // Or can be passed in as an object instead:
//   // let key = keyto.from({key: pemPrivate}, 'pem').toJwk('public');
//   // assertEqual(jwk, key);
// };
export const generateJwkFromPrivateKeyPEM = (privateKeyPEM) => {
    return keyto.from(privateKeyPEM, 'pem').toJwk('public');
};
export const fromPemToHex = (keyPEM) => {
    return keyto.from(keyPEM, 'pem').toString('blk', 'private');
};
