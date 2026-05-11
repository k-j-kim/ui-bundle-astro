import { createDataSDK } from '@salesforce/sdk-data';

// `createDataSDK()` returns a Promise — it performs async auth handshake with
// the UI Bundle runtime before the client is usable. We memoize the Promise
// so every island shares one resolution; callers do `const sdk = await sdkPromise;`.
export const sdkPromise: Promise<any> = Promise.resolve(createDataSDK());

export async function runQuery(graphqlQuery: string, variables?: Record<string, unknown>) {
  const sdk = await sdkPromise;
  if (!sdk.graphql) throw new Error('DataSDK.graphql is not available on this surface');
  return sdk.graphql({ query: graphqlQuery, variables });
}
