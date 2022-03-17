import {Linking} from 'react-native';
import Provider, {
  SIOPError,
  SIOPRequestValidationError,
  SIOPResponseGenerationError,
} from '@datasign/siop';
import {Resolver} from 'did-resolver';
import {getResolver as getWebResolver} from 'web-did-resolver';
import {EdDSASigner} from 'did-jwt';

const signIn = async () => {
  // Assume we've received this url from RP.
  const siopRequest =
    'https://example.com/deeplink?response_type=id_token&scope=openid%20did_authn&client_id=<...>&request_uri=<...>';
  try {
    const idTokenExpiresIn = 3600;
    const resolver = new Resolver({...getWebResolver()});
    const provider = new Provider(idTokenExpiresIn, resolver);
    const {clientId} = await provider.receiveRequest(siopRequest);

    // Generate a SIOP response.
    let location = await provider.generateResponse('did:example:persona1', {
      kid: 'did:example:persona1#key-1',
      sign: EdDSASigner(
        // A base64url-encoded Ed25519 private key.
        '9eV2fPFTMZUXYw8iaHa4bIFgzFg7wBN0TGvyVfXMDuUngRf8FExyNA9n0PIxboOGzv+/KyQoycUf73xZfx1Cbg==',
      ) as (data: string | Uint8Array) => Promise<string>,
      signAlgorithm: 'EdDSA',
      publicKey: new Uint8Array([
        39, 129, 23, 252, 20, 76, 114, 52, 15, 103, 208, 242, 49, 110, 131, 134,
        206, 255, 191, 43, 36, 40, 201, 197, 31, 239, 124, 89, 127, 29, 66, 110,
      ]),
    });
    await Linking.openURL(location);
  } catch (error) {
    if (error instanceof SIOPError) {
      if (error instanceof SIOPRequestValidationError) {
        // `error` is throwed at `receiveRequest()` in this case.
        console.error(error.error);
        console.error(error.invalidField);
        console.error(error.invalidValue);
      } else if (error instanceof SIOPResponseGenerationError) {
        // `error` is throwed at `generateResponse()`.
        console.error(error);
      }
      // Generate a redirect url able to be used as a error response to the RP.
      location = error.toResponse();
      await Linking.openURL(location);
    }
  }
};
