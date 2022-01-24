import { config } from "@keystone-6/core";
import { DATABASE_URL, PORT } from "./config";
import { withAuth, session } from "./auth";
import { lists } from "./schema";
import { insertSeedData } from "./seed-data";

const keystone = withAuth(
  config({
    db: {
      provider: "postgresql",
      useMigrations: true,
      url: DATABASE_URL,
      async onConnect(context) {
        if (process.env.SEED_DATA) {
          await insertSeedData(context);
        }
      },
    },

    lists,
    server: {
      port: PORT,
    },
    session,
  })
);

export default keystone;
