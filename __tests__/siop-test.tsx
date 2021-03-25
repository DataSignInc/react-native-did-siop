// Note: test renderer must be required after react-native.
import {Provider} from '../src/siop';

describe('siop', () => {
  const provider = new Provider(
    'did:web:assets-datasign.s3-ap-northeast-1.amazonaws.com:siop-test:user',
    '278a5de700e29faae8e40e366ec5012b5ec63d36ec77e8a2417154cc1d25383f',
  );

  test('sample', () => {
    provider;
  });

  // test.each([['did:example:12#ab']])('valid kid', (kid) => {
  //   provider.validateKid(kid, {jwks: {}});
  // });
});
