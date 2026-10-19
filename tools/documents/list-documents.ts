import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";

export function toolMeta() {
  return {
    name: "documents_list_documents",
    description: "Lists all documents of the project resolved from the integration token.",
    inputSchema: z.object({}).toJSONSchema(),
  };
}

export async function toolHandler() {
  const sdk = createSDK(getConfig());
  const result = await sdk.documents.listDocuments();

  return { data: result };
}