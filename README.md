# react-native-did-siop

## Targeting Specifications

* https://identity.foundation/did-siop/
* https://bitbucket.org/openid/connect/src/master/openid-connect-self-issued-v2-1_0.md

## Usage

~~~typescript
        try {
          const idTokenExpiresIn = 3600;
          const provider = new Provider(idTokenExpiresIn);
          const clientId = await provider.receiveRequestParameters(route.params);  // route.params is parsed by react-navigation

          // you can choose your personas based on the clientId returned above.
          let location = await provider.generateResponse(
            'did:web:did.datasign.co',
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
~~~

## Limitation / Future Tasks

* JWE is not supported.
* Currently the ec keys with the `secp256k1` curve is the only supported key type for users. RP can use other types of keys.
* You need to choose personas only with the `client_id` of RP. Other parameters sent from RP are not exposed to outside of the library.
* Some parameter validations are omitted.
    - validating whether `jwks` in `registration` parameter contains `iss` in request objects.
    - Additional did authn verification when `kid`s in request object and jwt header are different.
* Protocol negotiation based on the `registration` parameter is skipped.
* the `request_uri` parameter is not supported.