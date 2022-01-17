/** @type {import('next').NextConfig} */

const { withTsGql } = require("@ts-gql/next");

module.exports = withTsGql({
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/graphql",
        destination:
          process.env.NODE_ENV === "production"
            ? "https://40k-cards-production.up.railway.app/api/graphql"
            : "http://localhost:3000/api/graphql",
      },
    ];
  },
});
