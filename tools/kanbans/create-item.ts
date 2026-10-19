import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

const itemTypeSchema = z.enum(["column", "panel", "card"]);

const columnPayload = z.object({
  name: z.string().describe("Display name of the column"),
  order: z.number().optional().describe("0-indexed position"),
  stateUpdates: z.record(z.any(), z.any()).optional().describe("Auto-state rules"),
});

const panelPayload = z.object({
  columnId: z.string().describe("Parent column identifier"),
  title: z.string().describe("Display title"),
  color: z.string().optional().describe("Hex color code"),
  order: z.number().optional().describe("0-indexed position"),
  stateUpdates: z.record(z.any(), z.any()).optional().describe("Auto-state rules"),
});

const cardPayload = z.object({
  columnId: z.string().describe("Parent column identifier"),
  data: z.record(z.any(), z.any()).describe("Card data matching the dashboard template"),
  panelId: z.string().optional().describe("Optional panel identifier"),
  order: z.number().optional().describe("Position within container"),
});

export function toolMeta() {
  return {
    name: "kanbans_create_item",
    description: "Creates a new item (column, panel, or card) within a dashboard.",
    inputSchema: z.object({
      dashboardId: z.string().describe("Dashboard identifier"),
      type: itemTypeSchema.describe("Item type: column, panel, or card"),
      payload: z.union([columnPayload, panelPayload, cardPayload]).describe("Item-specific payload"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { dashboardId, type, payload } = args as {
    dashboardId: string;
    type: "column" | "panel" | "card";
    payload: Record<string, unknown>;
  };
  const sdk = createSDK(getConfig());

  let result: unknown;

  switch (type) {
    case "column": {
      result = await sdk.kanbans.createItem(dashboardId, "column" as any, payload as any);
      break;
    }
    case "panel": {
      result = await sdk.kanbans.createItem(dashboardId, "panel" as any, payload as any);
      break;
    }
    case "card": {
      result = await sdk.kanbans.createItem(dashboardId, "card" as any, payload as any);
      break;
    }
  }

  return { data: result };
}