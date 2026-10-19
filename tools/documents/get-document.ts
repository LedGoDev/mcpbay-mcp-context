import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

export function toolMeta() {
  return {
    name: "documents_get_document",
    description: "Retrieves a single document by its ID.",
    inputSchema: z.object({
      documentId: z.string().describe("Document identifier"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { documentId } = args as { documentId: string };
  const sdk = createSDK(getConfig());
  const result = await sdk.documents.getDocument(documentId);

  return { data: result };
}