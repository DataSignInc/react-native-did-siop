import * as JWT from '../src/jwt';
import {defaultResolver} from './consts';

describe('jwt', () => {
  const jwt =
    'eyJhbGciOiJFUzI1NksiLCJ0eXAiOiJKV1QiLCJraWQiOiJkaWQ6c3R1YjpycC0xI2NvbnRyb2xsZXIifQ.eyJpc3MiOiJkaWQ6c3R1YjpycC0xIiwicmVzcG9uc2VfdHlwZSI6ImlkX3Rva2VuIiwic2NvcGUiOiJvcGVuaWQgZGlkX2F1dGhuIiwiY2xpZW50X2lkIjoiaHR0cHM6Ly9leGFtcGxlLmNvbS9ob21lIiwicmVnaXN0cmF0aW9uIjp7ImF1dGhvcml6YXRpb25fZW5kcG9pbnQiOiJvcGVuaWQ6IiwiaXNzdWVyIjoiaHR0cHM6Ly9zZWxmLWlzc3VlZC5tZS92MiIsInJlc3BvbnNlX3R5cGVzX3N1cHBvcnRlZCI6WyJpZF90b2tlbiJdLCJzY29wZXNfc3VwcG9ydGVkIjpbIm9wZW5pZCJdLCJjcmVkZW50aWFsX2Zvcm1hdHNfc3VwcG9ydGVkIjpbImp3dF92YyJdLCJzdWJqZWN0X3R5cGVzX3N1cHBvcnRlZCI6WyJwYWlyd2lzZSJdLCJzdWJqZWN0X2lkZW50aWZpZXJfdHlwZXNfc3VwcG9ydGVkIjpbImRpZDp3ZWI6IiwiZGlkOnN0dWI6Il0sImlkX3Rva2VuX3NpZ25pbmdfYWxnX3ZhbHVlc19zdXBwb3J0ZWQiOlsiRVMyNTZLIl0sInJlcXVlc3Rfb2JqZWN0X3NpZ25pbmdfYWxnX3ZhbHVlc19zdXBwb3J0ZWQiOlsiRVMyNTZLIl0sInJlZGlyZWN0X3VyaXMiOlsiaHR0cHM6Ly9leGFtcGxlLmNvbS9ob21lIl0sImRpZCI6ImRpZDpzdHViOnJwLTEifSwicmVkaXJlY3RfdXJpIjoiaHR0cHM6Ly9leGFtcGxlLmNvbS9ob21lIiwia2lkIjoiZGlkOnN0dWI6cnAtMSNjb250cm9sbGVyIn0.C8ls9bhZ2kgj4CGJsx4bCD6y2or5T8nIdmE2TaMXbOJa0lnLvU3oQmKaWsk8tkS-B5Rap-Fhx0DkTUrHN2XDsA';
  test('verify', async () => {
    await JWT.verifyJWT(jwt, defaultResolver);
  });

  test('JWK thumbprint', () => {
    const minimalJwk = {
      kty: 'EC',
      crv: 'K-256',
      x: 'rT61nvuz2LCRzx4W1EfEwGAiVgCuN6aKTW-PZ46qD1E',
      y: 'ABGl1Pr6v7nVwvaa1g14m5M7oGgqs23Fpf780x-VJpM',
    };
    expect(JWT.calculateJWKThumprint(minimalJwk)).toBe(
      'UCKoaM6I76JIu46bGUaCfMSnQwMUIuKmoRF0bnYzLd4',
    );
  });
});
