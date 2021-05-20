// Note: test renderer must be required after react-native.
import * as consts from './consts';

import * as utils from '../src/sioputils';

describe('siop', () => {
  const jwt = 'ey...';
  test('getRequestObject', async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(jwt),
      }),
    );
    const params = {
      request_uri: 'https://example.com',
    };
    await expect(utils.getRequestObject(params)).resolves.toMatch(jwt);
  });
});
