import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

export function toolMeta() {
  return {
    name: "kanbans_list_dashboards",
    description: "Lists all kanban dashboards for the organization.",
    inputSchema: z.object({}).toJSONSchema(),
  };
}

export async function toolHandler() {
  const sdk = createSDK(getConfig());
  const result = await sdk.kanbans.listDashboards();

  return { data: result };
}
