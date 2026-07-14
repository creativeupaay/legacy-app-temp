import mongoose from "mongoose";
import AuthUser from "../src/modules/auth/models/authuser.model";
import { env } from "../src/config/env.config";

async function run() {
  await mongoose.connect(env.MONGO_URI);
  const now = new Date();

  // Find all users who are not triggered and are active
  const users = await AuthUser.find({
    "trigger.status": "not_triggered",
    isActive: true,
  });

  let triggeredCount = 0;
  for (const user of users) {
    const lastActive = user.lastActiveAt || user.createdAt;
    if (!lastActive) continue;

    const inactivityDays = user.trigger?.inactivityDays ?? 90;
    const diffMs = now.getTime() - new Date(lastActive).getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);

    if (diffDays >= inactivityDays) {
      user.trigger.status = "triggered";
      user.trigger.triggeredAt = now;
      await user.save();
      console.log(`User ${user.email} marked as TRIGGERED due to ${Math.round(diffDays)} days of inactivity (threshold: ${inactivityDays} days).`);
      triggeredCount++;
    }
  }

  console.log(`Inactivity check complete. Marked ${triggeredCount} user(s) as triggered.`);
  await mongoose.disconnect();
}

run().catch((err) => {
  console.error("Inactivity check script failed:", err);
  process.exit(1);
});
