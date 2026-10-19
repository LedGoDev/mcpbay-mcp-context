import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

export function toolMeta() {
  return {
    name: "databases_delete_record",
    description: "Deletes a record from a database.",
    inputSchema: z.object({
      databaseId: z.string().describe("Database identifier"),
      recordId: z.string().describe("Record identifier"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { databaseId, recordId } = args as { databaseId: string; recordId: string };
  const sdk = createSDK(getConfig());

  await sdk.databases.deleteRecord(databaseId, recordId);

  return { data: { success: true } };
}
