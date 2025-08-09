import mongoose from "mongoose";

export async function syncAllIndexes() {
  for (const name of mongoose.modelNames()) {
    const model = mongoose.model(name);
    await model.syncIndexes();
  }
  console.log("*** DEVELOPMENT: All indexes synced. ***");
}
