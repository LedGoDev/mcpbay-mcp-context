import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

export function toolMeta() {
  return {
    name: "documents_delete_block",
    description: "Deletes a block from a document.",
    inputSchema: z.object({
      documentId: z.string().describe("Document identifier"),
      blockId: z.string().describe("Block identifier"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { documentId, blockId } = args as { documentId: string; blockId: string };
  const sdk = createSDK(getConfig());

  await sdk.documents.deleteBlock(documentId, blockId);

  return { data: { success: true } };
}