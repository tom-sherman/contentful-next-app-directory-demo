import "server-only";
import { cache } from "react";
import DataLoader from "dataloader";
import { TypedDocumentNode } from "@graphql-typed-document-node/core";
import { Client, fetchExchange } from "@urql/core";
import { cacheExchange as createCacheExchange } from "@urql/exchange-graphcache";

interface AbitraryQueryWithVariables<
  TResult = any,
  TVariables = Record<string, any>
> {
  query: TypedDocumentNode<TResult, TVariables>;
  variables?: TVariables;
  fetchOptions?: RequestInit;
}

interface UntypedResult {
  [key: string]: any;
}

interface ContentfulLoader {
  /**
   * Loads a key, returning a `Promise` for the value represented by that key.
   */
  load: <TResult = unknown, TVariables = Record<string, unknown>>(
    query: AbitraryQueryWithVariables<TResult, TVariables>
  ) => Promise<TResult>;

  /**
   * Loads multiple keys, promising an array of values:
   *
   *     var [ a, b ] = await myLoader.loadMany([ 'a', 'b' ]);
   *
   * This is equivalent to the more verbose:
   *
   *     var [ a, b ] = await Promise.all([
   *       myLoader.load('a'),
   *       myLoader.load('b')
   *     ]);
   *
   */
  loadMany: <const TQueries extends readonly AbitraryQueryWithVariables[]>(
    queries: TQueries
  ) => Promise<{
    [K in keyof TQueries]: TQueries[K] extends AbitraryQueryWithVariables
      ? TQueries[K]["query"] extends TypedDocumentNode<infer TResult, any>
        ? TResult | Error
        : never
      : never;
  }>;
}

const cacheExchange = createCacheExchange({
  keys: new Proxy(
    {},
    {
      get() {
        return (data: any) => data?.sys?.id ?? null;
      },
    }
  ),
});

const client = new Client({
  url: `https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`,
  // TODO: Implement exchange that adds `sys {id}` to all queries of type names that are included in contentfulEntryTypeNames.ts
  exchanges: [cacheExchange, fetchExchange],
  fetchOptions: {
    headers: {
      Authorization: `Bearer ${process.env.CONTENTFUL_CONTENT_DELIVERY_API_KEY}`,
    },
  },
});

export const contentful = cache(() => {
  const loader = new DataLoader<AbitraryQueryWithVariables, UntypedResult>(
    (queries) => {
      console.log(`Loading ${queries.length} queries...`);

      // TODO: Merge into a single query as per https://github.com/graphql/graphql-js/issues/1428#issuecomment-406887068
      return Promise.all(
        queries.map((query) =>
          client
            .query(query.query, query.variables ?? {}, query.fetchOptions)
            .toPromise()
            .then((result) => result.data)
        )
      );
    }
  );

  return loader as ContentfulLoader;
});
