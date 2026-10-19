import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";
import { IFormField } from "@ledgo/sdk";

const fieldSchema = z.object({
  id: z.string().describe("Field identifier"),
  type: z.enum(["string", "integer", "boolean", "array", "number", "null"]).describe("Field data type"),
  title: z.string().describe("Display label"),
  description: z.string().optional().describe("Help text"),
  required: z.boolean().optional().describe("Whether the field is mandatory"),
  enum: z.array(z.string()).optional().describe("Allowed values"),
  uiWidget: z.string().optional().describe("UI component hint (e.g., textarea, select)"),
});

export function toolMeta() {
  return {
    name: "kanbans_create_dashboard",
    description: "Creates a new kanban dashboard with an optional card template.",
    inputSchema: z.object({
      name: z.string().describe("Display name of the dashboard"),
      cardTemplate: z.array(fieldSchema).optional().describe("Field definitions for card data model"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { name, cardTemplate } = args;
  const sdk = createSDK(getConfig());
  const result = await sdk.kanbans.createDashboard({ name: name as string, cardTemplate: cardTemplate as IFormField[] });

  return { data: result };
}