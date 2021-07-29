# react-native-did-siop

## Targeting Specifications

* https://identity.foundation/did-siop/
* https://bitbucket.org/openid/connect/src/master/openid-connect-self-issued-v2-1_0.md

## Install

1. `yarn add react-native-did-siop`

No React Native polyfills are needed.

## Usage

~~~typescript
import Provider from 'react-native-did-siop';
import {SIOPError, SIOPRequestValidationError, SIOPResponseGenerationError} from 'react-native-did-siop';

...

        try {
          const idTokenExpiresIn = 3600;
          const resolver = new Resolver({...getWebResolver()});
          const provider = new Provider(idTokenExpiresIn, resolver);
          // route.params is parsed by react-navigation.
          const clientId = await provider.receiveRequest(route.params);

          // you can choose your personas based on the clientId returned above.
          let location = await provider.generateResponse(
            'did:example:users-did',
            keyPair,  // keyPair generated by the elliptic library
          );
          await Linking.openURL(location);
        } catch (error) {
          if (error instanceof SIOPError) {
              if (error instanceof SIOPRequestValidationError) {
                  console.error(error.error)
                  console.error(error.invalidField)
                  console.error(error.invalidValue)
              }
              else if (error instanceof SIOPResponseGenerationError) {
                  console.error(error)
              }
            //   location = error.toResponse();  // we'll implement it in near future!
            //   await Linking.openURL(location);
          }
        }
~~~

## Limitation / Future Tasks

* JWE is not supported.
* Currently the ec keys with the `secp256k1` curve is the only supported key type for users. RP can use other types of keys.
* You need to choose personas only with the `client_id` of RP. Other parameters sent from RP are not exposed to outside of the library.
* Some parameter validations are omitted. These are:
    - Validating `jwks` in `registration` parameter contains `iss` in request objects.
    - Additional did authn verification when `kid`s in request object and jwt header are different.
* Protocol negotiation based on the `registration` parameter is skipped. Its future support will not change the API of the library because this negotiation doesn't add extra network communication. 