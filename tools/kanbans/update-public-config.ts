import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";
import { kanbanPublicConfigSchema } from "../@sdk/_kanban-blueprint-schemas.ts";

export function toolMeta() {
  return {
    name: "kanbans_update_public_config",
    description:
      "Creates or updates the public provider configuration of a blueprint dashboard. Only the provided fields " +
      "are written; the rest keep their stored value.",
    inputSchema: kanbanPublicConfigSchema.extend({
      dashboardId: z.string().describe("Dashboard identifier"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { dashboardId, workspacePath, ...payload } = args as Record<string, unknown>;
  const sdk = createSDK(getConfig());
  const result = await sdk.kanbans.updatePublicConfig(dashboardId as string, payload as any);

  return { data: result };
}
