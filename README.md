# @datasign/siop

[![codecov](https://codecov.io/gh/DataSignInc/react-native-did-siop/branch/main/graph/badge.svg?token=0NP95CEWE8)](https://codecov.io/gh/DataSignInc/react-native-did-siop)

Yet another SIOP library! It focuses to provide clean and universal APIs to implement the SIOP authentication flow in DID wallets. It runs on browser environments as well as on mobile devices.

## Targeting Specifications

- https://identity.foundation/did-siop/ (deprecated)
- https://openid.net/specs/openid-connect-self-issued-v2-1_0.html (still in draft)

## Install

1. `yarn add @datasign/siop`

It works both for React Native and the browser environments. No React Native polyfills are needed.

## Usage

```typescript
const provider = new Provider(idTokenExpiresInInSeconds, didResolver);
const {clientId, iss, kid} = await provider.receiveRequest(siopRequestUrl);
let location = await provider.generateResponse(
  'did:example:persona1',
  {
    kid: 'did:example:persona1#controller',
    sign: signFunction,
    alg: 'ES256K',
    minimalJwk: minimalJWK,
  },
  {vp_uri: 'https://credentials.example.xyz/12345'},
);
await Linking.openURL(location);
```

See [examples/](./examples/) directory for more detailed samples with different types of keys.

## Limitation / Future Tasks

- We do not support JWE both for ID tokens and SIOP requests.
- Some parameter validations are omitted. These are:
  - Asserting `jwks` in `registration` parameter contains `iss` in request objects.
  - Additional did authn verification when `kid`s in request object and jwt header are different.
- Protocol negotiation based on the `registration` parameter is skipped.
