import { z } from "zod";
import { createSDK, getConfig } from "../@sdk/_client.ts";
import { createBlockSchema } from "../@sdk/_schemas.ts";

export function toolMeta() {
  return {
    name: "documents_create_blocks",
    description:
      "Creates several blocks inside an existing document in a single request (one server transaction). " +
      "Use it when a document needs many blocks at once instead of one creation per block. " +
      "Each block's config shape is validated against its widgetType. " +
      "The sheet uses a 12-column grid and the title block is always full-width (w: 12).",
    inputSchema: z.object({
      documentId: z.string().describe("Document identifier"),
      blocks: z.array(createBlockSchema).describe("Blocks created inside the document in the same transaction"),
    }).toJSONSchema(),
  };
}

export async function toolHandler(args: Record<string, unknown>) {
  const { documentId, blocks } = args as {
    documentId: string;
    blocks: Array<Record<string, unknown>>;
  };
  const sdk = createSDK(getConfig());
  const result = await sdk.documents.createBlocks(documentId, blocks as any);

  return { data: result };
}