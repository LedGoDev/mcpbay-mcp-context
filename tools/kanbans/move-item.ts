import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

export function toolMeta() {
  return {
    name: "kanbans_move_item",
    description: "Moves an item to a new container or changes its position within the current container.",
    inputSchema: z.object({
      id: z.string().describe("Item identifier"),
      type: z.enum(["column", "panel", "card"]).describe("Item type: column, panel, or card"),
      targetId: z.string().describe("Target container ID (column or panel)"),
      position: z.number().describe("New position index (0-based)"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { id, type, targetId, position } = args as {
    id: string;
    type: "column" | "panel" | "card";
    targetId: string;
    position: number;
  };
  const sdk = createSDK(getConfig());

  await sdk.kanbans.moveItem(id, type as any, targetId, position);

  return { data: { success: true } };
}