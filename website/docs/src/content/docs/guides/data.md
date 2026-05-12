---
title: Data with the SDK
description: Fetching Salesforce records from React islands.
---

ui-bundle-astro pre-wires `@salesforce/sdk-data` so your islands can query records
without touching the network manually.

## The shared SDK instance

```ts
// src/lib/sdk.ts
import { createDataSDK } from '@salesforce/sdk-data';
export const sdk = createDataSDK();
```

Importing `sdk` from any island gives you the same instance, which keeps
caching and dedupe behavior consistent.

## Querying records

```tsx
import { useEffect, useState } from 'react';
import { sdk } from '@lib/sdk';

type Account = { Id: string; Name: string };

export function Accounts() {
  const [rows, setRows] = useState<Account[]>([]);
  useEffect(() => {
    sdk
      .query<Account>('SELECT Id, Name FROM Account ORDER BY Name LIMIT 100')
      .then(setRows);
  }, []);

  return (
    <ul>
      {rows.map((a) => (
        <li key={a.Id}>{a.Name}</li>
      ))}
    </ul>
  );
}
```

## Typing your queries

For richer types, install `@graphql-codegen/cli` and `vite-plugin-graphql-codegen`,
then point them at your `.graphql` files. The generated hooks plug
straight into the SDK.

## Server-side data

`.astro` components can `await` data at build time:

```astro
---
import { fetchOrgMetadata } from '@lib/build-data';
const orgs = await fetchOrgMetadata();
---
<ul>
  {orgs.map((o) => <li>{o.name}</li>)}
</ul>
```

This lives in the static HTML — no runtime cost.
