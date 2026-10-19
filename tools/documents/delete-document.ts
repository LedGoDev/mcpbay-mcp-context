import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

export function toolMeta() {
  return {
    name: "documents_delete_document",
    description: "Deletes a document and all its blocks.",
    inputSchema: z.object({
      documentId: z.string().describe("Document identifier"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { documentId } = args as { documentId: string };
  const sdk = createSDK(getConfig());

  await sdk.documents.deleteDocument(documentId);

  return { data: { success: true } };
}