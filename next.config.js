/** @type {import('next').NextConfig} */

const { withTsGql } = require("@ts-gql/next");

module.exports = withTsGql({
  reactStrictMode: true,
});
