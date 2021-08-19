export const base64Tobase64url = (b64: string) =>
  b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/[=]/g, '');
