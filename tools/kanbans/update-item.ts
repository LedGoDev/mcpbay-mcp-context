import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

const itemTypeSchema = z.enum(["column", "panel", "card"]);

const columnUpdate = z.object({
  name: z.string().optional().describe("New display name"),
  order: z.number().optional().describe("New position"),
  stateUpdates: z.record(z.any(), z.any()).optional().describe("Auto-state rules"),
});

const panelUpdate = z.object({
  columnId: z.string().optional().describe("New parent column"),
  title: z.string().optional().describe("New title"),
  color: z.string().optional().describe("Hex color code"),
  order: z.number().optional().describe("New position"),
  stateUpdates: z.record(z.any(), z.any()).optional().describe("Auto-state rules"),
});

const cardUpdate = z.object({
  columnId: z.string().optional().describe("New parent column"),
  data: z.record(z.any(), z.any()).optional().describe("Updated card data"),
  panelId: z.string().optional().describe("New panel identifier"),
  order: z.number().optional().describe("New position"),
});

export function toolMeta() {
  return {
    name: "kanbans_update_item",
    description: "Updates an existing item (column, panel, or card).",
    inputSchema: z.object({
      id: z.string().describe("Item identifier"),
      type: itemTypeSchema.describe("Item type: column, panel, or card"),
      payload: z.union([columnUpdate, panelUpdate, cardUpdate]).describe("Fields to update"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { id, type, payload } = args as {
    id: string;
    type: "column" | "panel" | "card";
    payload: Record<string, unknown>;
  };
  const sdk = createSDK(getConfig());
  const result = await sdk.kanbans.updateItem(id, type as any, payload);

  return { data: result };
}