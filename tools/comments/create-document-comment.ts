import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

export function toolMeta() {
  return {
    name: "comments_create_document_comment",
    description:
      "Creates a comment (or a reply with parentId) anchored to a document block.",
    inputSchema: z.object({
      documentId: z.string().describe("Identifier of the document the block belongs to"),
      kind: z
        .enum(["block"])
        .describe("Kind of the commented element. Documents only support block comments."),
      blockId: z
        .string()
        .describe("Identifier of the document block the comment is anchored to"),
      body: z.string().describe("Text content of the comment"),
      parentId: z
        .string()
        .optional()
        .describe("Identifier of the parent comment to reply to, omitted for a top-level comment"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { documentId, kind, blockId, body, parentId } = args as {
    documentId: string;
    kind: "block";
    blockId: string;
    body: string;
    parentId?: string;
  };
  const sdk = createSDK(getConfig());
  const target = { kind, blockId };
  const result = await sdk.comments.createForDocument(documentId, {
    target,
    body,
    parentId,
  });

  return { data: result };
}
