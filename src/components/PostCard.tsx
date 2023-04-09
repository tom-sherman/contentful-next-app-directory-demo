import { contentful } from "@/contentful";
import { graphql } from "@/gql";

interface Props {
  id: string;
}

const PostCardQuery = graphql(/* GraphQL */ `
  query PostCard($id: String!) {
    pageBlogPost(id: $id) {
      title
      slug
      author {
        name
        avatar {
          url
        }
      }
      publishedDate
      shortDescription
      seoFields {
        shareImagesCollection(limit: 1) {
          items {
            url
            description
          }
        }
      }
    }
  }
`);

export async function PostCard({ id }: Props) {
  const data = await contentful().load({
    query: PostCardQuery,
    variables: { id },
  });

  const post = data.pageBlogPost;

  if (!post) {
    throw new Error("No post");
  }

  return (
    <div className="flex flex-col overflow-hidden bg-white rounded shadow-md text-slate-500 shadow-slate-200 sm:flex-row">
      {/*  <!-- Image --> */}
      <figure className="flex-1">
        <img
          src={post.seoFields?.shareImagesCollection?.items[0]?.url!}
          alt={post.seoFields?.shareImagesCollection?.items[0]?.description!}
          className="object-cover min-h-full aspect-auto"
        />
      </figure>
      {/*  <!-- Body--> */}
      <div className="flex-1 p-6 sm:mx-6 sm:px-0">
        <header className="flex gap-4 mb-4">
          <div className="relative inline-flex items-center justify-center w-12 h-12 text-white rounded-full">
            <img
              src={post.author?.avatar?.url!}
              alt={post.author?.name!}
              title={post.author?.name!}
              width="48"
              height="48"
              className="max-w-full rounded-full"
            />
          </div>
          <div>
            <h3 className="text-xl font-medium text-slate-700">{post.title}</h3>
            <p className="text-sm text-slate-400">
              By {post.author?.name}, {post.publishedDate}
            </p>
          </div>
        </header>
        <p>{post.shortDescription}</p>
      </div>
    </div>
  );
}
