## React Server Components + Contentful

## Goals

- Fully typed graphql queries
- As many queries as you like, they're all batched up and sent in one request
- Normalised cache for queries within a single request
- Showcase react server components with contentful's graphql api

## Getting Started

```bash
pnpm install
```

Then, run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## How does it work?

Any react server component can load a graphql query like this:

```jsx
const data = await contentful().load(someGraphqlDocument);
```

Usually you'd need to combine all graphql queries into one document and send them in one request but in the RSC model we can do this automatically for a single render using React's `cache` API and `DataLoader`. This allows for multiple graphql queries without multiple HTTP requests.


```jsx
// This only sends one request to contentful
await Promise.all(
  contentful().load(someGraphqlDocument),
  contentful().load(oherGraphqlDocument)
);
```

A more realistic example:

```jsx
const ArticleSummaryDocument = graphql(`
  query ArticleSummary($id: String!) {
    article(id: $id) {
      title
      author {
        name
      }
    }
  }
`);

async function ArticleSummary({ id }) {
  const data = await contentful().load(
    ArticleSummaryDocument,
    { id }
  );

  return (
    <div>
      <h1>{data.article.title}</h1>
      <p>By {data.article.author.name}</p>
    </div>
  );
}

// And then if we do this in some page, only one request is sent to contentful
<ArticleSummary id={1} />
<ArticleSummary id={2} />
```

Additionally, we maintain a normalised cache of all queries within a single render. This means that if you have two components that both query the same data, it will only be fetched once. It enables the following code to only send one request to contentful, `data2` is resolved instantly:

```jsx
const data1 = await contentful().load(doc);
const data2 = await contentful().load(doc);
```

### What's `contentful()`?

`contentful()` is a function that returns a `DataLoader` instance. It's a singleton that's shared across all calls within a single RSC render.

### What's `DataLoader`?

`DataLoader` is a utility that batches up all queries within a single tick and sends them in one request.

### Query Merging

> **Note** This is not implemented yet

`DataLoader` batches up all queries within a single tick for us, but we still need to merge them into one document. This can be done by following the technique described in this [2018 GitHub comment](https://github.com/graphql/graphql-js/issues/1428#issuecomment-406887068):

1. Merge the AST trees of the query while automatically aliasing fields that have naming conflicts
2. Run the resulting query against the Contentful's GraphQL API
3. Transform the result object back to an array of the responses of all individual queries and return.
