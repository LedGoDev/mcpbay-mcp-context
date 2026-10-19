import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

export function toolMeta() {
  return {
    name: "comments_create_comment",
    description:
      "Creates a comment (or a reply with parentId) anchored to a database, one of its columns, a record or a single cell.",
    inputSchema: z.object({
      databaseId: z.string().describe("Identifier of the database the comment is anchored to"),
      kind: z
        .enum(["database", "column", "record", "cell"])
        .describe("Kind of the commented element: the database itself, a column, a record or a cell"),
      recordId: z
        .string()
        .optional()
        .describe("Identifier of the record, required when kind is record or cell"),
      field: z
        .string()
        .optional()
        .describe("Name of the schema property, required when kind is column or cell"),
      body: z.string().describe("Text content of the comment"),
      parentId: z
        .string()
        .optional()
        .describe("Identifier of the parent comment to reply to, omitted for a top-level comment"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { databaseId, kind, recordId, field, body, parentId } = args as {
    databaseId: string;
    kind: "database" | "column" | "record" | "cell";
    recordId?: string;
    field?: string;
    body: string;
    parentId?: string;
  };
  const sdk = createSDK(getConfig());
  const target = { kind, recordId, field };
  const result = await sdk.comments.createForDatabase(databaseId, {
    target,
    body,
    parentId,
  });

  return { data: result };
}