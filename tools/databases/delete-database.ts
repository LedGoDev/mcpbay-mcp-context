import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

export function toolMeta() {
  return {
    name: "databases_delete_database",
    description: "Deletes a database and all its records.",
    inputSchema: z.object({
      id: z.string().describe("Database identifier"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { id } = args as { id: string };
  const sdk = createSDK(getConfig());

  await sdk.databases.deleteDatabase(id);

  return { data: { success: true } };
}
