import {RSA} from 'react-native-rsa-native';
import {getItem} from '../keychain';

export const generateKeyPair = async () => {
  const keys = await RSA.generateKeys(4096); // set key size
  return keys;
};

export const sign = async (data: string) => {
  const privateKey = await getItem('my-first-private-key');
  return await RSA.sign(data, privateKey);
};

export const testGeneration = async () => {
  let message = 'my secret message';

  const keys = await RSA.generateKeys(4096); // set key size
  console.log('4096 private:', keys.private); // the private key
  console.log('4096 public:', keys.public); // the public key
  const encodedMessage = await RSA.encrypt(message, keys.public);
  console.log(`the encoded message is ${encodedMessage}`);
  const decryptedMessage = await RSA.decrypt(encodedMessage, keys.private);
  console.log(`The original message was ${decryptedMessage}`);
};
