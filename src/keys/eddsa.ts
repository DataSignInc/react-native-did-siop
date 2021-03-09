// Twisted Edwards curve
import {eddsa as EdDSA} from 'elliptic';
import base64url from 'base64url';

const eddsa = (value: string) => {
  // Create and initialize EdDSA context
  // (better do it once and reuse it)
  var ec = new EdDSA('ed25519');

  // Create key pair from secret
  var key = ec.keyFromSecret(
    '470f299139cce2159bfe3937449e3f7affd8029461ee1dde6001d9acbaca4ad4',
  ); // hex string, array or Buffer

  // Sign the message's hash (input must be an array, or a hex-string)
  var msgHash = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  var signature = key.sign(value).toHex();
  // Verify signature
  console.log(key.verify(value, signature));
  return signature;
};

const encode = (obj: any) => {
  return base64url.encode(JSON.stringify(obj));
};
const createJWS = (header: any, payload: any) => {
  const content = encode(header) + '.' + encode(payload);
  const signature = eddsa(content);
  return content + '.' + signature;
};
