import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

export function toolMeta() {
  return {
    name: "databases_create_database",
    description: "Creates a new custom database structure with an optional JSON Schema.",
    inputSchema: z.object({
      name: z.string().describe("Display name of the database"),
      description: z.string().optional().describe("Purpose description"),
      schema: z.record(z.any(), z.any()).optional().describe("JSON Schema defining record structure"),
      uiSchema: z.record(z.any(), z.any()).optional().describe("UI layout and presentation rules"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { name, description, schema, uiSchema } = args as {
    name: string;
    description?: string;
    schema?: Record<string, unknown>;
    uiSchema?: Record<string, unknown>;
  };
  const sdk = createSDK(getConfig());
  const result = await sdk.databases.createDatabase({ name, description, schema, uiSchema });

  return { data: result };
}
