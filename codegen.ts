import type { CodegenConfig } from "@graphql-codegen/cli";
require("dotenv").config({ path: "./.env.local" });

const config: CodegenConfig = {
  overwrite: true,
  schema: {
    [`https://graphql.contentful.com/content/v1/spaces/${process.env.CONTENTFUL_SPACE_ID}`]:
      {
        headers: {
          Authorization: `Bearer ${process.env.CONTENTFUL_CONTENT_DELIVERY_API_KEY}`,
        },
      },
  },
  documents: ["src/**/*.tsx", "src/**/*.ts"],
  generates: {
    "src/gql/": {
      preset: "client",
      plugins: [],
      config: {
        scalars: {
          DateTime: "string",
        },
      },
    },
  },
  hooks: { afterAllFileWrite: ["prettier --write"] },
};

export default config;
