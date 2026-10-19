import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";
import { kanbanAccessLinkSchema } from "../@sdk/_kanban-blueprint-schemas.ts";

export function toolMeta() {
  return {
    name: "kanbans_create_access_link",
    description:
      "Mints a signed access link for a blueprint dashboard. The link grants read or edit access to the public " +
      "route and can be restricted by TTL, single use, and allowed containers.",
    inputSchema: kanbanAccessLinkSchema.extend({
      dashboardId: z.string().describe("Dashboard identifier"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { dashboardId, workspacePath, ...payload } = args as Record<string, unknown>;
  const sdk = createSDK(getConfig());
  const result = await sdk.kanbans.createAccessLink(dashboardId as string, payload as any);

  return { data: result };
}
