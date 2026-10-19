import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";
import { kanbanScopeSchema } from "../@sdk/_kanban-blueprint-schemas.ts";

export function toolMeta() {
  return {
    name: "kanbans_set_scope",
    description:
      "Updates the visibility scope of a kanban dashboard. Publishing a board (public) is subject to the " +
      "organization plan limit.",
    inputSchema: z.object({
      dashboardId: z.string().describe("Dashboard identifier"),
      scope: kanbanScopeSchema.describe("New visibility scope"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { dashboardId, scope } = args as {
    dashboardId: string;
    scope: "public" | "organization" | "project";
  };
  const sdk = createSDK(getConfig());
  const result = await sdk.kanbans.setScope(dashboardId, scope as any);

  return { data: result };
}
