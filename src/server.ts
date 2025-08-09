import "dotenv/config";
import { createApp } from "./app";
import { connectMongo, disconnectMongo } from "./db/mongoose";
import { syncAllIndexes } from "./db/sync-database";

async function main() {
  await connectMongo(process.env.MONGODB_URI!);
  const app = createApp();
  const port = Number(process.env.PORT) || 3000;

  const server = app.listen(port, () =>
    console.log(`Server has started on "http://localhost:${port}"`)
  );
  // Sync all indexes in the database
  if (process.env.NODE_ENV !== "production") {
    await syncAllIndexes();
  }

  // Graceful shutdown for MongoDB and server
  const shutdown = async () =>
    server.close(async () => {
      await disconnectMongo();
      process.exit(0);
    });
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
