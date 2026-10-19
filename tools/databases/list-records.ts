import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

export function toolMeta() {
  return {
    name: "databases_list_records",
    description: "Lists all records within a specific database.",
    inputSchema: z.object({
      databaseId: z.string().describe("Database identifier"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { databaseId } = args as { databaseId: string };
  const sdk = createSDK(getConfig());
  const result = await sdk.databases.listRecords(databaseId);

  return { data: result };
}
