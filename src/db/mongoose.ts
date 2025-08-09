import mongoose from "mongoose";

let isConnected = false;

export async function connectMongo(uri: string) {
  if (isConnected) return;
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri);
  isConnected = true;
  mongoose.connection.on("connected", () => console.log("[mongo] connected"));
  mongoose.connection.on("error", (err) =>
    console.error("[mongo] error:", err)
  );
}

export async function disconnectMongo() {
  if (isConnected) {
    await mongoose.connection.close();
    isConnected = false;
  }
}
