import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

export function toolMeta() {
  return {
    name: "kanbans_list_items",
    description: "Lists all items (columns, panels, and cards) within a dashboard.",
    inputSchema: z.object({
      dashboardId: z.string().describe("Dashboard identifier"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { dashboardId } = args as { dashboardId: string };
  const sdk = createSDK(getConfig());
  const result = await sdk.kanbans.listItems(dashboardId);

  return { data: result };
}