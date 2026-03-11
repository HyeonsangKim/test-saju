import { deleteExpiredReports } from "@/lib/db/report.repository";

export async function cleanupExpiredReports(retentionDays = 30) {
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - retentionDays);

  const count = await deleteExpiredReports(cutoff);
  return count;
}
