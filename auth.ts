import { statelessSessions } from "@keystone-6/core/session";
import { createAuth } from "@keystone-6/auth";
import { SESSION_MAX_AGE, SESSION_SECRET } from "./config";

const { withAuth } = createAuth({
  // This is the list that contains items people can sign in as
  listKey: "User",
  // The identity field is typically a username or email address
  identityField: "email",
  // The secret field must be a password type field
  secretField: "password",
  // initFirstItem turns on the "First User" experience, which prompts you to create a new user
  // when there are no items in the list yet
  initFirstItem: {
    // These fields are collected in the "Create First User" form
    fields: ["name", "email", "password"],
  },
});

const session = statelessSessions({
  maxAge: SESSION_MAX_AGE,
  // The session secret is used to encrypt cookie data (should be an environment variable)
  secret: SESSION_SECRET,
});

export { withAuth, session };
