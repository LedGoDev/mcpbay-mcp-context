import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";
import { createBlockSchema } from "../@sdk/_schemas.ts";

export function toolMeta() {
  return {
    name: "documents_create_block",
    description:
      "Creates a single block inside an existing document (one server transaction). " +
      "The sheet uses a 12-column grid and the title block is always full-width (w: 12).",
    inputSchema: z.object({
      documentId: z.string().describe("Document identifier"),
      block: createBlockSchema.describe("Block to create inside the document"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { documentId, block } = args as {
    documentId: string;
    block: Record<string, unknown>;
  };
  const sdk = createSDK(getConfig());
  const result = await sdk.documents.createBlock(documentId, block as any);

  return { data: result };
}