import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

export function toolMeta() {
  return {
    name: "kanbans_delete_item",
    description: "Deletes an item (column, panel, or card) by its ID and type.",
    inputSchema: z.object({
      id: z.string().describe("Item identifier"),
      type: z.enum(["column", "panel", "card"]).describe("Item type: column, panel, or card"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { id, type } = args as { id: string; type: "column" | "panel" | "card" };
  const sdk = createSDK(getConfig());

  await sdk.kanbans.deleteItem(id, type as any);

  return { data: { success: true } };
}