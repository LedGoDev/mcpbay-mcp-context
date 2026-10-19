import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

export function toolMeta() {
  return {
    name: "comments_list_document_comments",
    description:
      "Lists the cross-cutting comments anchored to a document, optionally filtered to one block target key.",
    inputSchema: z.object({
      documentId: z.string().describe("Identifier of the document the comments belong to"),
      targetKey: z
        .string()
        .optional()
        .describe("Optional deterministic target key to filter a single block"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { documentId, targetKey } = args as { documentId: string; targetKey?: string };
  const sdk = createSDK(getConfig());
  const result = await sdk.comments.listForDocument(documentId, targetKey);

  return { data: result };
}
