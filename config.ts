const dotenv = require("dotenv");
const fs = require("fs");

let config = {};

// we don't have a .env file in prod so fixing this so it doesn't crash
try {
  config = dotenv.parse(fs.readFileSync(".env"));
} catch (e) {}

export const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

export const DATABASE_URL =
  process.env.DATABASE_URL ||
  `postgres://${process.env.USER}@localhost/40k-cards`;

// Default to 30 days
export const SESSION_MAX_AGE = process.env.SESSION_MAX_AGE
  ? parseInt(process.env.SESSION_MAX_AGE)
  : 60 * 60 * 24 * 30;

// If the environment doesn't supply a value, default the secret to a secure random string
// This will cause all cookies to be invalidated with each app restart (annoying but better than having a hardcoded default)
// A secure value will be set in your Railway deploy if you use the "Deploy on Railway" button or follow the instructions in the README
export const SESSION_SECRET =
  process.env.SESSION_SECRET ||
  config.SESSION_SECRET ||
  require("crypto")
    .randomBytes(32)
    .toString("base64")
    .replace(/[^a-zA-Z0-9]+/g, "");

export const IS_IN_NEXT = process.env.IS_IN_NEXT || false;
