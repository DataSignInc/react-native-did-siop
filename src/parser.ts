import queryString from 'query-string';

export default class URLParser {
  // openid://?response_type=id_token
  // &client_id=https%3A%2F%2Frp.example.com%2Fcb
  // &scope=openid%20did_authn
  // &request=<JWT>
  private url: string;

  constructor(url: string) {
    this.url = url;
  }

  // async parse() {
  //   this.validateScheme();
  //   const params = this.getParameters();
  //   const jwt = params.request;
  //   try {
  //     const verifiedJWT = await verifyJWT(jwt);
  //     const decoded = didJWT.decodeJWT(jwt);
  //     return {params: params, request: decoded};
  //   } catch (error) {
  //     console.error(error);
  //     throw error;
  //   }
  // }

  validateScheme() {
    return this.url.startsWith('openid://');
  }

  getParameters() {
    const {url, query} = queryString.parseUrl(this.url);
    // scope, response_type and client_id are only for backward compatibility.

    return query;
  }

  validateParameters(params: any) {}
}
