import { graphql } from "@/gql";
import { contentful } from "@/contentful";
import { PostCard } from "@/components/PostCard";

const HomePageQuery = graphql(/* GraphQL */ `
  query HomePage {
    pageLanding(id: "3vrx9Ezv34q2B8pY0kjP25") {
      featuredBlogPost {
        __typename
        sys {
          id
        }
      }
    }
  }
`);

export default async function Home() {
  const data = await contentful().load({ query: HomePageQuery });
  const featuredBlogPost = data.pageLanding?.featuredBlogPost;
  if (!featuredBlogPost) {
    throw new Error("No featured blog post");
  }

  return (
    <>
      {/* @ts-expect-error */}
      <PostCard id={featuredBlogPost.sys.id} />
    </>
  );
}
