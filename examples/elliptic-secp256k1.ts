import {Linking} from 'react-native';

import {Resolver} from 'did-resolver';
import {getResolver as getWebResolver} from 'web-did-resolver';
import {ES256KSigner} from 'did-jwt';
import {ec as EC} from 'elliptic';

import Provider, {
  SIOPError,
  SIOPRequestValidationError,
  SIOPResponseGenerationError,
} from '@datasign/siop';

const ec = new EC('secp256k1');

const privateKeyHex =
  '9702a6dd71bda7f7fdbf524b9c5dcdb8ba6aabd9df629373b0e31b46d68f6710';
const keyPair = ec.keyFromPrivate(privateKeyHex);

const signIn = async () => {
  // Assume we've received this url from RP.
  const siopRequest =
    'https://example.com/deeplink?response_type=id_token&scope=openid%20did_authn&client_id=<...>&request_uri=<...>';
  try {
    const idTokenExpiresIn = 3600;
    const resolver = new Resolver({...getWebResolver()});
    // Instantiate Self-Issued OpenID Provider.
    const provider = new Provider(idTokenExpiresIn, resolver);
    // Parse and validate the SIOP request coming from RP.
    // You can also pass a parameter parsed by react-navigation.
    const {clientId, iss, kid} = await provider.receiveRequest(siopRequest);

    // Generate a SIOP response.
    // You can choose your personas based on the information returned above.
    let location = await provider.generateResponse(
      'did:example:persona1',
      {
        kid: 'did:example:persona1#controller',
        sign: ES256KSigner(privateKeyHex),
        alg: 'ES256K',
        minimalJwk: getMinimalJWK(keyPair),
      },
      {vp_uri: 'https://credentials.example.xyz/12345'},
    );
    // You can use `location` directly as a redirect url to RP.
    await Linking.openURL(location);
  } catch (error) {
    if (error instanceof SIOPError) {
      if (error instanceof SIOPRequestValidationError) {
        // `error` was throwed at `receiveRequest()` in this case.
        console.error(error.error);
        console.error(error.invalidField);
        console.error(error.invalidValue);
      } else if (error instanceof SIOPResponseGenerationError) {
        // `error` was throwed at `generateResponse()`.
        console.error(error);
      }
      // Generate a redirect url to use as the error response to the RP.
      location = error.toResponse();
      await Linking.openURL(location);
    }
  }
};

export const getMinimalJWK = (keyPair: EC.KeyPair) => {
  const publicKey = keyPair.getPublic();
  const encodePoint = (point: Buffer) =>
    point
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/[=]/g, '');
  return {
    kty: 'EC',
    crv: 'P-256K',
    x: encodePoint(publicKey.getX().toArrayLike(Buffer, 'be', 32)),
    y: encodePoint(publicKey.getY().toArrayLike(Buffer, 'be', 32)),
  };
};
