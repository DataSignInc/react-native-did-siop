// Note: test renderer must be required after react-native.
import {Provider} from '../src/siop';
import * as consts from './consts';

describe('siop', () => {
  const provider = new Provider(
    'did:web:assets-datasign.s3-ap-northeast-1.amazonaws.com:siop-test:user',
    '278a5de700e29faae8e40e366ec5012b5ec63d36ec77e8a2417154cc1d25383f',
  );

  test('receiveRequestParamaters() raises no errors', async () => {
    await expect(
      provider.receiveRequestParameters(consts.request),
    ).resolves.toBe(consts.client_id);
  });
});
