import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

export function toolMeta() {
  return {
    name: "kanbans_delete_dashboard",
    description: "Deletes a kanban dashboard and all its columns, panels, and cards.",
    inputSchema: z.object({
      id: z.string().describe("Dashboard identifier"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { id } = args as { id: string };
  const sdk = createSDK(getConfig());

  await sdk.kanbans.deleteDashboard(id);

  return { data: { success: true } };
}
