
import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

export function toolMeta() {
  return {
    name: "kanbans_update_dashboard",
    description: "Updates an existing kanban dashboard's name or card template.",
    inputSchema: z.object({
      id: z.string().describe("Dashboard identifier"),
      name: z.string().optional().describe("New display name"),
      cardTemplate: z.array(z.record(z.any(), z.any())).optional().describe("Updated field definitions"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { id, workspacePath, ...payload } = args;
  const sdk = createSDK(getConfig());
  const result = await sdk.kanbans.updateDashboard(id as string, payload);

  return { data: result };
}
