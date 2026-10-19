import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

export function toolMeta() {
  return {
    name: "comments_list_comments",
    description:
      "Lists the cross-cutting comments anchored to a database, optionally filtered to one target (database, column, record or cell).",
    inputSchema: z.object({
      databaseId: z.string().describe("Identifier of the database the comments belong to"),
      targetKey: z
        .string()
        .optional()
        .describe("Optional deterministic target key to filter a single element"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { databaseId, targetKey } = args as { databaseId: string; targetKey?: string };
  const sdk = createSDK(getConfig());
  const result = await sdk.comments.listForDatabase(databaseId, targetKey);

  return { data: result };
}