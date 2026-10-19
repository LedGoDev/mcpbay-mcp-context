import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

export function toolMeta() {
  return {
    name: "databases_update_record",
    description: "Updates an existing database record with new data.",
    inputSchema: z.object({
      databaseId: z.string().describe("Database identifier"),
      recordId: z.string().describe("Record identifier"),
      data: z.record(z.any(), z.any()).describe("Updated record data"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { databaseId, recordId, data } = args as {
    databaseId: string;
    recordId: string;
    data: Record<string, unknown>;
  };
  const sdk = createSDK(getConfig());
  const result = await sdk.databases.updateRecord(databaseId, recordId, data);

  return { data: result };
}
