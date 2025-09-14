import { requestVoid } from "@/services/http";

export async function deleteTask(id: string): Promise<void> {
  await requestVoid(`/api/task/${encodeURIComponent(id)}`, { method: "DELETE" });
}
