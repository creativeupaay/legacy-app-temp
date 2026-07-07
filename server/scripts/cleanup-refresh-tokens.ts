import mongoose from "mongoose";
import User from "../src/modules/auth/models/authuser.model";
import { env } from "../src/config/env.config";

async function run() {
  await mongoose.connect(env.MONGO_URI);
  const now = new Date();
  const users = await User.find({ "refreshTokens.0": { $exists: true } }).select("+refreshTokens");

  let cleaned = 0;
  for (const user of users) {
    const before = user.refreshTokens.length;
    user.refreshTokens = user.refreshTokens.filter(
      (rt: any) => rt.expiresAt > now
    );
    if (user.refreshTokens.length !== before) {
      await user.save();
      cleaned++;
    }
  }
  console.log(`Pruned expired tokens on ${cleaned} user(s).`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("Cleanup script failed:", err);
  process.exit(1);
});
