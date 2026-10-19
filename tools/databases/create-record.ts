import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

export function toolMeta() {
  return {
    name: "databases_create_record",
    description: "Creates a new record in a database with the provided data.",
    inputSchema: z.object({
      databaseId: z.string().describe("Database identifier"),
      data: z.record(z.any(), z.any()).describe("Record data. Must conform to the database schema."),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { databaseId, data } = args as { databaseId: string; data: Record<string, unknown> };
  const sdk = createSDK(getConfig());
  const result = await sdk.databases.createRecord(databaseId, data);

  return { data: result };
}
