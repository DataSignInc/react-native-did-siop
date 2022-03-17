export const base64ToBase64url = (b64: string) =>
  b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/[=]/g, '');

const encodeBufferInBase64url = (point: Buffer) =>
  base64ToBase64url(point.toString('base64'));

export const encodeUint8ArrayInBase64url = (point: Uint8Array) =>
  base64ToBase64url(Buffer.from(point).toString('base64'));
