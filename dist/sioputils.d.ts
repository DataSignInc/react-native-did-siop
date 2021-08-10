import queryString from 'query-string';
import { Registration } from './siop-schema';
export declare const getIssuedAt: () => number;
export declare const parseSIOPRequestUri: (uri: string) => queryString.ParsedQuery<string>;
export declare const getRequestObject: (params: any) => Promise<any>;
export declare const getRegistration: (request: any) => Promise<Registration>;
export declare const getJwks: (registration: Registration) => Promise<any>;
