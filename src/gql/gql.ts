/* eslint-disable */
import * as types from "./graphql";
import { TypedDocumentNode as DocumentNode } from "@graphql-typed-document-node/core";

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
  '\n  query HomePage {\n    pageLanding(id: "3vrx9Ezv34q2B8pY0kjP25") {\n      featuredBlogPost {\n        __typename\n        sys {\n          id\n        }\n      }\n    }\n  }\n':
    types.HomePageDocument,
  "\n  query PostCard($id: String!) {\n    pageBlogPost(id: $id) {\n      title\n      slug\n      author {\n        name\n        avatar {\n          url\n        }\n      }\n      publishedDate\n      shortDescription\n      seoFields {\n        shareImagesCollection(limit: 1) {\n          items {\n            url\n            description\n          }\n        }\n      }\n    }\n  }\n":
    types.PostCardDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: '\n  query HomePage {\n    pageLanding(id: "3vrx9Ezv34q2B8pY0kjP25") {\n      featuredBlogPost {\n        __typename\n        sys {\n          id\n        }\n      }\n    }\n  }\n'
): (typeof documents)['\n  query HomePage {\n    pageLanding(id: "3vrx9Ezv34q2B8pY0kjP25") {\n      featuredBlogPost {\n        __typename\n        sys {\n          id\n        }\n      }\n    }\n  }\n'];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(
  source: "\n  query PostCard($id: String!) {\n    pageBlogPost(id: $id) {\n      title\n      slug\n      author {\n        name\n        avatar {\n          url\n        }\n      }\n      publishedDate\n      shortDescription\n      seoFields {\n        shareImagesCollection(limit: 1) {\n          items {\n            url\n            description\n          }\n        }\n      }\n    }\n  }\n"
): (typeof documents)["\n  query PostCard($id: String!) {\n    pageBlogPost(id: $id) {\n      title\n      slug\n      author {\n        name\n        avatar {\n          url\n        }\n      }\n      publishedDate\n      shortDescription\n      seoFields {\n        shareImagesCollection(limit: 1) {\n          items {\n            url\n            description\n          }\n        }\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> =
  TDocumentNode extends DocumentNode<infer TType, any> ? TType : never;
