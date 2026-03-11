import { cleanupExpiredReports } from "@/lib/report/delete-expired-reports";

async function main() {
  console.log("[cleanup] Starting expired reports cleanup...");
  const count = await cleanupExpiredReports(30);
  console.log(`[cleanup] Deleted ${count} expired report(s).`);
  process.exit(0);
}

main().catch((err) => {
  console.error("[cleanup] Error:", err);
  process.exit(1);
});
