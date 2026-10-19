
import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

export function toolMeta() {
  return {
    name: "databases_update_database",
    description: "Updates an existing database's name, description, or schemas.",
    inputSchema: z.object({
      id: z.string().describe("Database identifier"),
      name: z.string().optional().describe("New name"),
      description: z.string().optional().describe("New description"),
      schema: z.record(z.any(), z.any()).optional().describe("New JSON Schema"),
      uiSchema: z.record(z.any(), z.any()).optional().describe("New UI Schema"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { id, workspacePath, ...payload } = args as Record<string, unknown>;
  const sdk = createSDK(getConfig());
  const result = await sdk.databases.updateDatabase(id as string, payload);

  return { data: result };
}
