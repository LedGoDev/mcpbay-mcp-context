import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

export function toolMeta() {
  return {
    name: "comments_list_kanban_comments",
    description:
      "Lists the cross-cutting comments anchored to a kanban dashboard, optionally filtered to one card target key.",
    inputSchema: z.object({
      dashboardId: z.string().describe("Identifier of the kanban dashboard the comments belong to"),
      targetKey: z
        .string()
        .optional()
        .describe("Optional deterministic target key to filter a single card"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { dashboardId, targetKey } = args as { dashboardId: string; targetKey?: string };
  const sdk = createSDK(getConfig());
  const result = await sdk.comments.listForKanban(dashboardId, targetKey);

  return { data: result };
}
