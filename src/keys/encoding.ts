export const base64ToBase64url = (b64: string) =>
  b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/[=]/g, '');
