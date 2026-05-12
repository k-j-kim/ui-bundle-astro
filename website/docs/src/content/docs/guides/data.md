---
title: Querying data
description: Using the Salesforce Data SDK to fetch records from React islands.
---

The template pre-wires `@salesforce/sdk-data` so React islands can query records via the UI API GraphQL endpoint.

## SDK setup

The shared SDK instance lives in `src/lib/sdk.ts`:

```ts
// src/lib/sdk.ts
import { createDataSDK } from '@salesforce/sdk-data';

export const sdkPromise: Promise<any> = Promise.resolve(createDataSDK());

export async function runQuery(
  graphqlQuery: string,
  variables?: Record<string, unknown>,
) {
  const sdk = await sdkPromise;
  if (!sdk.graphql)
    throw new Error('DataSDK.graphql is not available on this surface');
  return sdk.graphql({ query: graphqlQuery, variables });
}
```

`createDataSDK()` performs an async auth handshake with the UI Bundle runtime. The promise is memoized so every island shares one resolution.

## Querying records

Call `runQuery()` from any React component:

```tsx
import { useEffect, useState } from 'react';
import { runQuery } from '@lib/sdk';

export default function AccountCount() {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const res = await runQuery(`
        query {
          uiapi {
            query {
              Account(first: 0) {
                totalCount
              }
            }
          }
        }
      `);
      setCount(res?.data?.uiapi?.query?.Account?.totalCount ?? 0);
    })();
  }, []);

  if (count === null) return <span>Loading…</span>;
  return <span>{count} accounts</span>;
}
```

## GraphQL query structure

The UI API GraphQL endpoint uses this shape:

```graphql
query AccountList {
  uiapi {
    query {
      Account(
        first: 25,
        orderBy: { Name: { order: ASC } }
      ) {
        edges {
          node {
            Id
            Name { value }
            Industry { value }
          }
        }
      }
    }
  }
}
```

Key details:
- Each field returns `{ value }`, not the raw value directly.
- `first` controls the page size.
- `orderBy` takes the field name as a key with `{ order: ASC | DESC }`.
- The response follows the Relay connection pattern: `edges[].node`.

## Building queries dynamically

The `RecordList` component builds its query from the column spec:

```ts
const fields = columns.map(c => `${c.field} { value }`).join(' ');
const gql = `
  query ${sobject}List {
    uiapi {
      query {
        ${sobject}(first: ${first}, orderBy: { ${orderBy}: { order: ${orderDir} } }) {
          edges { node { Id ${fields} } }
        }
      }
    }
  }
`;
```

Then extracts values from the response:

```ts
const edges = res?.data?.uiapi?.query?.[sobject]?.edges ?? [];
const rows = edges.map((e: any) => {
  const node = e.node;
  const out: any = { Id: node.Id };
  for (const c of columns)
    out[c.field] = node?.[c.field]?.value ?? null;
  return out;
});
```

## TypeScript types

Add types for your records:

```ts
interface Account {
  Id: string;
  Name: string;
  Industry: string | null;
  Type: string | null;
  Phone: string | null;
}
```

## Error handling

`runQuery()` throws if the SDK isn't available or the query fails. The `RecordList` component wraps the call in a try/catch:

```tsx
try {
  const res = await runQuery(gql);
  // process response
} catch (e: any) {
  setError(e?.message ?? String(e));
}
```

This shows an error message in the UI instead of crashing the island.

## Local development

During `npm run dev`, the SDK isn't connected to a real Salesforce org. Queries will fail with a "not available on this surface" error. To test with real data:

1. Build: `npm run build`
2. Deploy: `sf project deploy start --source-dir force-app/main/default/uiBundles --target-org my-org`
3. Open the bundle in your org
