import {SIOPResponseGenerationError} from '../src/error';
// import {defaultResolver} from './consts';

describe('error', () => {
  test('toResponse()', () => {
    const expected =
      'https://example.com/#error=invalid_request&error_uri=https%3A%2F%2Ftools.ietf.org%2Fhtml%2Frfc6749%23section-4.2.2.1&state=af0ifjsldkj';
    const clientId = 'https://example.com/';
    const state = 'af0ifjsldkj';
    const error = new SIOPResponseGenerationError(
      'invalid_request',
      clientId,
      state,
    );

    expect(error.toResponse()).toBe(expected);
  });
});
