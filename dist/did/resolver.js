import { Resolver } from 'did-resolver';
import { getResolver as getEthrResolver } from 'ethr-did-resolver';
import { getResolver as getWebResolver } from 'web-did-resolver';
export const getResolver = () => {
    // TODO: cache resolver to initialize it only once. But avoid concurrently creating two (or more) instances of it.
    const ethrDid = getEthrResolver({
        rpcUrl: 'https://ropsten.infura.io/v3/e0a6ac9a2c4a4722970325c36b728415',
    });
    const webResolver = getWebResolver();
    return new Resolver(Object.assign(Object.assign({}, ethrDid), webResolver));
};
